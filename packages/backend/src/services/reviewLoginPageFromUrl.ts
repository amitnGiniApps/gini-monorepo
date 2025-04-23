import OpenAI from 'openai';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_CONFIGURATION_KEY,
});

const ISSUE_CHECKLIST = [
  'Email input should use type="email", not type="text".',
  'Password input should use proper type and be validated for length.',
  'Red border should only appear after input interaction (not on load or focus).',
  'Submit button should be disabled until form is valid.',
  'Error messages should appear only after blur or invalid entry.',
  'Form should not allow submission with invalid data.',
  'Password should have strength validation (not just min length).',
];

function createAuditPrompt(html: string, checklist: string[]): string {
  const formattedChecklist = checklist.map(item => `- ${item}`).join('\n');

  return `
You are reviewing the following login page's HTML for frontend UX and validation issues.

Use this checklist to guide your audit:

${formattedChecklist}

Only list the issues that are present in the HTML. For each issue found, follow **this exact format**:

1. **<Short Title of the Issue>**
   - **Issue:** <Explain the issue in one sentence.>
   - **Fix:** <Provide a clear one-line fix.>

Do not include any extra commentary or headings.

HTML:
\\\html
${html}
\\\
  `.trim();
}

// 🚀 Main function: Analyze a live page
export const reviewLoginPageFromUrl = async (url: string) => {
  console.log(url);
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const html = await page.content();
    const prompt = createAuditPrompt(html, ISSUE_CHECKLIST);

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert frontend auditor. Identify only present UX and validation issues and suggest concise fixes.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const result = response.choices[0].message?.content;
    console.log(result);
    return result;
  } catch (error: any) {
    console.error('❌ Error auditing page:', error.message);
    throw new Error('Failed to audit the login page.');
  } finally {
    if (browser) await browser.close();
  }
};

