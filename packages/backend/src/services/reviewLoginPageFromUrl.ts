import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { createPDF } from '../util/createPdf';
import { runSecurityChecks } from '../util/securityChecks';
import { issueTypeChecks } from '../util/issueTypeChecks';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
dotenv.config();


// 📝 Things we want to check for on the page
const ISSUE_CHECKLIST = [
  // ✏️ Good form rules
  'Email input should use type="email", not type="text".',
  'Password input should use proper type and be validated for length.',
  'Red border should only appear after you interact with the input.',
  'Submit button should be disabled until everything is filled properly.',
  'Error messages should show only when you make a mistake.',
  'Form should not let you send wrong information.',
  'Password should have strength checking (not just be long).',

  // ♿ Easy to use for everyone
  'All images must have helpful alt text.',
  'All form boxes must have labels.',
  'Buttons and links should work even if you only use the keyboard.',
  'Text colors should be easy to read (not too light).',

  // 🧹 Keep it clean
  'No console logs or errors when the page is ready for real users.',

  // 🔒 Stay safe
  'No sensitive info (like passwords) should be saved in the browser storage.',
  'Cookies must be safe and secure.',
  'Cookies should protect you from attackers (SameSite=Strict).',
  'LocalStorage should not be used to save secret login info.',
];

function createAuditPrompt(html: string, checklist: string[]): string {
  const formattedChecklist = checklist.map(item => `- ${item}`).join('\n');

  return `
You are checking the login page for problems like bad forms, bad accessibility, messy code, or unsafe things.

Here are things you should check:

${formattedChecklist}

List only the problems you really find.
Follow this simple structure:

1. **<Short Title>**
   - **Issue:** <One sentence about what's wrong.>
   - **Fix:** <One quick fix idea.>
   - **Severity:** <Critical / Major / Minor>

Don't add extra words. Just the structure.

HTML:
\\\html
${html}
\\\
  `.trim();
}

function extractIssues(resultText: string) {
  const issues = resultText.split(/\n(?=\d+\.\s\*\*)/g).map(block => {
    const titleMatch = block.match(/\*\*(.*?)\*\*/);
    const issueMatch = block.match(/- \*\*Issue:\*\* (.*)/);
    const fixMatch = block.match(/- \*\*Fix:\*\* (.*)/);
    const severityMatch = block.match(/- \*\*Severity:\*\* (.*)/);

    return {
      title: titleMatch ? titleMatch[1] : '',
      issue: issueMatch ? issueMatch[1] : '',
      fix: fixMatch ? fixMatch[1] : '',
      severity: severityMatch ? severityMatch[1] : 'Unknown',
    };
  });

  return issues.filter(i => i.title); // 🧹 Only keep real problems
}
export const reviewLoginPageFromUrl = async (url: string) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true }); // Open a hidden browser
    const page = await browser.newPage(); // 📄 Open a new tab
    await page.goto(url, { waitUntil: 'networkidle2' }); // Wait until the page is ready!

    // Check for security problems (like bad cookies or saved passwords)
    const securityFindings = await runSecurityChecks(page);

    // Use AI to check for form, UX, accessibility and messiness
    const html = await page.content(); // 📄 Get all the HTML from the page
    const prompt = createAuditPrompt(html, ISSUE_CHECKLIST); // ✏️ Create a question for the AI

    const MODEL_NAME = 'gini-site-checker-bot';

    const response = await axios.post('http://localhost:11434/api/generate', {
      model: MODEL_NAME,
      prompt,
      stream: false,
    });

    const gptAuditResult = response.data.response;
    if (!gptAuditResult) throw new Error('No audit result returned.');

    const gptIssues = extractIssues(gptAuditResult);

    // Group problems into categories
    const sections = issueTypeChecks([...gptIssues, ...securityFindings]);

    // Score each part
    const sectionScores = {
      UX: Math.max(100 - sections.UX.length * 5, 0),
      Accessibility: Math.max(100 - sections.Accessibility.length * 5, 0),
      Console: Math.max(100 - sections.Console.length * 5, 0),
      Security: Math.max(100 - sections.Security.length * 10, 0),
    };

    // Find the average score
    const averageScore = Math.round(
      (sectionScores.UX + sectionScores.Accessibility + sectionScores.Console + sectionScores.Security) / 4,
    );

    // Ensure the PDF folder exists
    const pdfDir = './pdfs';
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Make a beautiful PDF with the results
    const pdfPath = `${pdfDir}/audit-${Date.now()}.pdf`;
    await createPDF(sections, sectionScores, pdfPath);

    // Done! Return the scores and file
    return {
      overallScore: averageScore,
      sectionScores,
      sections,
      pdfPath,
    };
  } catch (error: any) {
    console.error('❌ Oops! Error checking page:', error.message);
    throw new Error('Failed to check the login page. Please try again.');
  } finally {
    if (browser) await browser.close();
  }
};
