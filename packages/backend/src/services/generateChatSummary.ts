import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { getChatFilePath, loadChatHistory } from '../util/chatUtils';
import { extractJsonBlock } from '../util/extractJsonBlock';

const SUMMARY_FOLDER = path.join(__dirname, '../summary');
if (!fs.existsSync(SUMMARY_FOLDER)) fs.mkdirSync(SUMMARY_FOLDER);

export async function generateChatSummary(sessionId: string, username: string) {

  console.log('start');
  const chatFilePath = getChatFilePath(username, sessionId);
  const chatHistory = loadChatHistory(chatFilePath);

  const summaryPrompt = {
    role: 'system',
    content: `
You are a summarizer. Given the full chat history between the user and GINO (the Gini-Apps bot), extract only the user's final structured request.

Output a clean JSON object in the following format:

{
  "user": {
    "fullName": "User's full name",
    "email": "User's email address",
    "companyName": "Company name",
    "companyLocation": "Company location or address",
    "phone": "Phone number (optional)"
  },
  "request": {
    // One of the following:
    
    // Product Development
    "serviceType": "Mobile App | Web App | SDK | Other",
    "businessUse": "...",
    "targetUsers": "...",
    "deliveryPreference": "Outsourcing | Team Hire | Consultation",
    "timeline": "...",
    "goal": "..."

    // OR Outsourcing
    "serviceType": "Outsourcing",
    "requiredRoles": ["Role1", "Role2"],
    "teamSize": Number,
    "workModel": "Remote | Hybrid | On-site",
    "timeline": "...",
    "duration": "..."

    // OR QA/Design
    "serviceType": "UX Design | UI Design | QA Testing",
    "projectContext": "...",
    "timeline": "...",
    "goal": "..."
  }
}

Rules:
- Only fill one of the service schemas — never mix fields.
- Include only what the user actually said.
- If a field was not mentioned or is unclear, omit it.
- Do not add any explanation or narrative. Return a valid JSON object only.
`,
  };

  try {
    const result = await axios.post('http://localhost:11434/api/chat', {
      model: 'gini-bot', // or whatever your MODEL_NAME is
      messages: [...chatHistory, summaryPrompt],
      stream: false,
    });
    const content = result.data.message?.content || result.data.response;
    const exportedJson = extractJsonBlock(content);

    if (!exportedJson) throw new Error('Empty summary response');

    fs.writeFileSync(path.join(SUMMARY_FOLDER, `${sessionId}.json`), JSON.stringify(exportedJson));
    return { success: true };

  } catch (error) {
    console.error('Error generating chat summary:', error);
    return { success: false, error: 'Summary generation failed' };
  }
}
