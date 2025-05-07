import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
// eslint-disable-next-line import/no-extraneous-dependencies
import bodyParser from 'body-parser';
import path from 'path';
import { promises } from 'fs';
import fs from 'fs';
import { exec } from 'child_process';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { config } from 'dotenv';
import gptRouter from './routes/gptRouter';
import { generateChatSessionId, getChatFilePath, loadChatHistory, saveChatHistory } from './util/chatUtils';
import { generateChatSummary } from './services/generateChatSummary';
// import { createDocFile } from './services/docBuilder';

config();

const app = express();

const SYSTEM_PATH = path.join(__dirname, 'system.txt');
const MODELFILE_PATH = path.join(__dirname, 'Modelfile');
const MODEL_NAME = 'gini-bot';

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/v2', gptRouter);

app.get('/api/v1/generate/:filename', async (req, res) => {
  let { filename } = req.params;

  if (!filename.endsWith('.html')) {
    filename += '.html';
  }

  const filePath = path.join(__dirname, 'public', filename);

  try {
    await promises.access(filePath);
    res.sendFile(filePath);
  } catch {
    res.status(404).send('File not found');
  }
});

async function rebuildModelled() {
  const systemContentRaw = await promises.readFile(SYSTEM_PATH, 'utf-8');
  const staticContentEndIndex = systemContentRaw.indexOf('**Model Information**');
  if (staticContentEndIndex === -1) throw new Error('Static system intro not found.');

  const staticIntro = systemContentRaw.slice(0, staticContentEndIndex).trim();
  const updatesContent = systemContentRaw.slice(staticContentEndIndex).trim();
  const updatesArray = updatesContent.split('\n\n').filter(Boolean);
  const numberedUpdates = updatesArray.map((item, idx) => `${idx + 1}. ${item.trim()}`).join('\n\n');

  const fullSystem = `
${staticIntro}

**Model Information**

${numberedUpdates}
`.trim();

  const modelfileContent = `
FROM gemma3:4b

PARAMETER temperature 1.2

SYSTEM """\n${fullSystem}\n"""
`.trim();

  await promises.writeFile(MODELFILE_PATH, modelfileContent, 'utf-8');
}

async function recreateOllamaModel() {
  return new Promise<void>((resolve, reject) => {
    exec(`ollama create ${MODEL_NAME} -f ${MODELFILE_PATH}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Failed to create model:', stderr);
        return reject(error);
      }
      console.log('Model recreated successfully:', stdout);
      resolve();
    });
  });
}

async function loadUpdates() {
  const systemContentRaw = await promises.readFile(SYSTEM_PATH, 'utf-8');
  const modelInfoStart = systemContentRaw.indexOf('**Model Information**');
  if (modelInfoStart === -1) throw new Error('Model Information section not found.');

  const updatesRaw = systemContentRaw.slice(modelInfoStart + '**Model Information**'.length).trim();
  return updatesRaw.split('\n\n').map(item => item.trim()).filter(Boolean);
}

async function saveUpdates(updatesArray: string[]) {
  const systemContentRaw = await promises.readFile(SYSTEM_PATH, 'utf-8');
  const modelInfoStart = systemContentRaw.indexOf('**Model Information**');
  if (modelInfoStart === -1) throw new Error('Model Information section not found.');

  const staticIntro = systemContentRaw.slice(0, modelInfoStart).trim();

  const rebuiltSystemTxt = `
${staticIntro}

**Model Information**

${updatesArray.join('\n\n')}
`.trim();

  await promises.writeFile(SYSTEM_PATH, rebuiltSystemTxt + '\n', 'utf-8');
}

export const HISTORY_DIR = path.join(__dirname, 'chats');
// Ensure the history directory exists
if (!fs.existsSync(HISTORY_DIR)) {
  fs.mkdirSync(HISTORY_DIR);
}

app.post('/chat', async (req, res) => {
  const { username, chatSessionId: incomingId, message: userPrompt } = req.body;

  if (!username || !userPrompt) {
    return res.status(400).json({ error: 'Missing username or message' });
  }

  const chatSessionId = incomingId || generateChatSessionId(username);
  const filePath = getChatFilePath(username, chatSessionId);

  // Rule-based responses
  const structuredResponses = {
    services: ['Web Development', 'Mobile App Development', 'Cloud Infrastructure', 'DevOps Consulting'],
    projects: [
      { name: 'Project Alpha', description: 'E-commerce platform' },
      { name: 'Project Beta', description: 'Real-time chat app' },
    ],
  };

  const lowerPrompt = userPrompt.toLowerCase();
  if (lowerPrompt.includes('services')) {
    return res.json({ chatSessionId, reply: 'The services list:', type: 'services', data: structuredResponses.services });
  }
  if (lowerPrompt.includes('projects')) {
    return res.json({ chatSessionId, reply: 'The Projects list:', type: 'projects', data: structuredResponses.projects });
  }
  if (lowerPrompt.includes('team')) {
    return res.json({ chatSessionId, reply: 'Our best team:', type: 'team', data: structuredResponses.projects });
  }
  if (lowerPrompt.includes('clients')) {
    return res.json({ chatSessionId, reply: 'Our Clients', type: 'clients', data: structuredResponses.projects });
  }
  if (lowerPrompt.includes('flow')) {
    return res.json({ chatSessionId, reply: 'Project Flow', type: 'flow', data: structuredResponses.projects });
  }

  const chatHistory = loadChatHistory(filePath);
  chatHistory.push({ role: 'user', content: userPrompt });

  try {
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: MODEL_NAME,
      messages: chatHistory,
      stream: false,
    });

    const botReply = response.data.message?.content || response.data.response;

    if (botReply) {
      chatHistory.push({ role: 'assistant', content: botReply });
      saveChatHistory(filePath, chatHistory);

      if (botReply.includes('Got it! We’re capturing the details and will follow up.') || botReply.includes('Would you like to talk to someone from our team, or keep going here?')) {
        generateChatSummary(chatSessionId, username); // don't await — fire-and-forget
      }

      return res.json({ chatSessionId, reply: botReply, box: true });
    } else {
      console.error('Unexpected Ollama response:', response.data);
      return res.status(502).json({ error: 'Invalid response from Ollama' });
    }

  } catch (error) {
    console.error('Error querying Ollama:', (error as any).message || error);
    return res.status(500).json({ error: 'Failed to query Ollama' });
  }
});


app.get('/list-model-info', async (req, res) => {
  try {
    const updates = await loadUpdates();
    res.json({ updates });
  } catch (error) {
    console.error('Error listing model info:', error);
    res.status(500).json({ error: 'Failed to list model info.' });
  }
});

app.post('/add-model-info', async (req, res) => {
  const { newInfo } = req.body;
  if (!newInfo) return res.status(400).json({ error: 'No info provided.' });

  try {
    const updates = await loadUpdates();
    updates.push(newInfo.trim());
    await saveUpdates(updates);
    await rebuildModelled();
    await recreateOllamaModel();
    res.json({ message: 'Info added and model updated.' });
  } catch (error) {
    console.error('Error adding model info:', error);
    res.status(500).json({ error: 'Failed to add model info.' });
  }
});

app.post('/edit-model-info', async (req, res) => {
  const { index, newInfo } = req.body;

  if (typeof index !== 'number' || typeof newInfo !== 'string') {
    return res.status(400).json({ error: 'Index (number) and newInfo (non-empty string) are required.' });
  }

  try {
    const updates = await loadUpdates();

    if (index < 0 || index >= updates.length) {
      return res.status(400).json({ error: 'Invalid index.' });
    }

    // noinspection TypeScriptUnresolvedReference
    updates[index] = newInfo.trim();

    await saveUpdates(updates);
    await rebuildModelled();
    await recreateOllamaModel();

    res.json({ message: 'Info edited and model updated successfully.' });
  } catch (error) {
    console.error('Error editing model info:', error);
    res.status(500).json({ error: 'Failed to edit model info.' });
  }
});

app.post('/delete-model-info', async (req, res) => {
  const { index } = req.body;
  if (index === undefined) return res.status(400).json({ error: 'Index is required.' });

  try {
    const updates = await loadUpdates();

    if (index < 0 || index >= updates.length) {
      return res.status(400).json({ error: 'Invalid index.' });
    }

    updates.splice(index, 1);

    await saveUpdates(updates);
    await rebuildModelled();
    await recreateOllamaModel();

    res.json({ message: 'Info deleted and model updated.' });
  } catch (error) {
    console.error('Error deleting model info:', error);
    res.status(500).json({ error: 'Failed to delete model info.' });
  }
});

// app.post('/test-doc', async (req, res) => {
//   try {
//     const filename = 'test-document.docx';
//     const filePath = await createDocFile(filename);
//
//     res.download(filePath, filename, (err) => {
//       if (!err) {
//         // fs.unlinkSync(filePath); // delete after sending
//       } else {
//         console.error('Download error:', err);
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Failed to create document');
//   }
// });

// Path to your folder with JSONs
const summaryDir = path.join(__dirname, 'summary');

app.get('/summaries', (req, res) => {
  fs.readdir(summaryDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read summary folder' });
    }

    const jsonFiles = files.filter(file => path.extname(file) === '.json');

    const summaries: any[] = [];

    jsonFiles.forEach((file, index) => {
      const filePath = path.join(summaryDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      try {
        summaries.push(JSON.parse(content));
      } catch (e) {
        console.warn(`Skipping invalid JSON: ${file}`);
      }

      // Send response after reading all files
      if (index === jsonFiles.length - 1) {
        res.json(summaries);
      }
    });
  });
});

app.post('/create/summary', async (req, res) => {
  const { sessionId, username } = req.body;

  if (!sessionId || !username) {
    return res.status(400).json({ error: 'Missing sessionId or username' });
  }

  try {
    const result = await generateChatSummary(sessionId, username);
    if (result.success) {
      return res.status(200).json({ message: 'Summary generated successfully' });
    } else {
      return res.status(500).json({ error: result.error });
    }
  } catch (err) {
    console.error('Summary route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default app;
