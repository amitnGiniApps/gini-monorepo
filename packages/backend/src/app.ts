import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import axios from 'axios';
import { config } from 'dotenv';
import gptRouter from './routes/gptRouter';

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

app.get('/api/v1/generate/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/map1.html'));
});

app.get('/api/v1/generate/map2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/map2.html'));
});

app.get('/api/v1/generate/map3', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/map3.html'));
});

app.get('/api/v1/generate/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/calendar.html'));
});

app.get('/api/v1/generate/dashboard1', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard-1.html'));
});

app.get('/api/v1/generate/dashboard2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard-2.html'));
});

app.get('/api/v1/generate/chat1', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/chat-conversation-1.html'));
});

app.get('/api/v1/generate/chat2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/chat-conversation-2.html'));
});

app.get('/api/v1/generate/track', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/track.html'));
});

app.get('/api/v1/generate/:filename', async (req, res) => {
  let { filename } = req.params;

  if (!filename.endsWith('.html')) {
    filename += '.html';
  }

  const filePath = path.join(__dirname, 'public', filename);

  try {
    await fs.access(filePath);
    res.sendFile(filePath);
  } catch {
    res.status(404).send('File not found');
  }
});

async function rebuildModelfile() {
  const systemContentRaw = await fs.readFile(SYSTEM_PATH, 'utf-8');
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

  await fs.writeFile(MODELFILE_PATH, modelfileContent, 'utf-8');
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
  const systemContentRaw = await fs.readFile(SYSTEM_PATH, 'utf-8');
  const modelInfoStart = systemContentRaw.indexOf('**Model Information**');
  if (modelInfoStart === -1) throw new Error('Model Information section not found.');

  const updatesRaw = systemContentRaw.slice(modelInfoStart + '**Model Information**'.length).trim();
  return updatesRaw.split('\n\n').map(item => item.trim()).filter(Boolean);
}

async function saveUpdates(updatesArray: string[]) {
  const systemContentRaw = await fs.readFile(SYSTEM_PATH, 'utf-8');
  const modelInfoStart = systemContentRaw.indexOf('**Model Information**');
  if (modelInfoStart === -1) throw new Error('Model Information section not found.');

  const staticIntro = systemContentRaw.slice(0, modelInfoStart).trim();

  const rebuiltSystemTxt = `
${staticIntro}

**Model Information**

${updatesArray.join('\n\n')}
`.trim();

  await fs.writeFile(SYSTEM_PATH, rebuiltSystemTxt + '\n', 'utf-8');
}

app.post('/chat', async (req, res) => {
  const userPrompt = req.body.message;

  if (!userPrompt) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: MODEL_NAME,
      prompt: userPrompt,
      stream: false,
    });

    if (response.data && response.data.response) {
      res.json({ reply: response.data.response, box: true });
    } else {
      console.error('Unexpected Ollama response:', response.data);
      res.status(502).json({ error: 'Invalid response from Ollama' });
    }
  } catch (error: unknown) {
    console.error('Error querying Ollama:', error);
    res.status(500).json({ error: 'Failed to query Ollama' });
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
    await rebuildModelfile();
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

    updates[index] = newInfo.trim();

    await saveUpdates(updates);
    await rebuildModelfile();
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
    await rebuildModelfile();
    await recreateOllamaModel();

    res.json({ message: 'Info deleted and model updated.' });
  } catch (error) {
    console.error('Error deleting model info:', error);
    res.status(500).json({ error: 'Failed to delete model info.' });
  }
});

export default app;
