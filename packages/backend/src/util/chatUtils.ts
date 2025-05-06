
// Sanitize input to be filesystem-safe
import path from 'path';
import fs from 'fs';
import { HISTORY_DIR } from '../app';

function sanitize(input: string) {
  return input.replace(/[^a-zA-Z0-9_-]/g, '');
}

// Generate unique session ID if needed
export function generateChatSessionId(username: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${sanitize(username)}_${timestamp}`;
}

// Get full file path for a session
export function getChatFilePath(username: string, chatSessionId: string) {
  return path.join(HISTORY_DIR, `${sanitize(chatSessionId)}.json`);
}

// Load chat history
export function loadChatHistory(filePath: string) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return [];
}

// Save chat history
export function saveChatHistory(filePath: string, history: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
}
