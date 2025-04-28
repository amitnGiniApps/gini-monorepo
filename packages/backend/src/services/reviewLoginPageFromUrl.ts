import OpenAI from 'openai';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { createPDF } from '../util/createPdf';
import { runSecurityChecks } from '../util/securityChecks';
import { issueTypeChecks } from '../util/issueTypeChecks';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_CONFIGURATION_KEY,
});

const ISSUE_CHECKLIST = [
  // UX & Validation
  'Email input should use type="email", not type="text".',
  'Password input should use proper type and be validated for length.',
  'Red border should only appear after input interaction (not on load or focus).',
  'Submit button should be disabled until form is valid.',
  'Error messages should appear only after blur or invalid entry.',
  'Form should not allow submission with invalid data.',
  'Password should have strength validation (not just min length).',

  // Accessibility
  'All images must have descriptive alt text.',
  'All form inputs must have associated <label> or aria-label/aria-labelledby attributes.',
  'Ensure that interactive elements (buttons, links) are accessible via keyboard navigation.',
  'Color contrast must meet WCAG minimum standards for text visibility.',

  // Console Cleanliness
  'Page must not contain console.log, console.warn, or console.error statements in production.',

  // Security
  'Sensitive information (like tokens, passwords) must not be stored in localStorage or sessionStorage.',
  'Cookies must have HttpOnly and Secure flags set.',
  'Session management should use SameSite=Strict cookies to prevent CSRF attacks.',
  'LocalStorage should not be used to persist authentication states or sensitive user information.',
];

function createAuditPrompt(html: string, checklist: string[]): string {
  const formattedChecklist = checklist.map(item => `- ${item}`).join('\n');

  return `
You are reviewing the following login page's HTML and JavaScript for frontend UX, validation, accessibility, console issues, and security vulnerabilities.

Use this checklist to guide your audit:

${formattedChecklist}

Only list the issues that are present in the HTML, from analyzing the visible page, or from identifying bad frontend security practices.

For each issue found, follow **this exact format exactly**:

1. **<Short Title of the Issue>**
   - **Issue:** <Explain the issue in one sentence.>
   - **Fix:** <Provide a clear one-line fix.>
   - **Severity:** <Choose one of: Critical, Major, Minor>

Do not include any extra commentary or headings. Only follow the exact structure.

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

  return issues.filter(i => i.title);
}

export const reviewLoginPageFromUrl = async (url: string) => {
  console.log(`Auditing: ${url}`);
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // --- Run real security checks (localStorage + cookies) ---
    const securityFindings = await runSecurityChecks(page);

    // --- GPT audit (UX, Accessibility, Console) ---
    const html = await page.content();
    const prompt = createAuditPrompt(html, ISSUE_CHECKLIST);

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert frontend auditor. Identify UX, validation, accessibility, console, and security issues.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const gptAuditResult = response.choices[0].message?.content;
    if (!gptAuditResult) throw new Error('No audit result returned.');

    const gptIssues = extractIssues(gptAuditResult);

    // --- Group into sections ---
    const sections = issueTypeChecks([...gptIssues, ...securityFindings]);

    // --- Calculate section scores ---
    const sectionScores = {
      UX: Math.max(100 - sections.UX.length * 5, 0),
      Accessibility: Math.max(100 - sections.Accessibility.length * 5, 0),
      Console: Math.max(100 - sections.Console.length * 5, 0),
      Security: Math.max(100 - sections.Security.length * 10, 0),
    };

    // --- Calculate overall score ---
    const averageScore = Math.round(
      (sectionScores.UX + sectionScores.Accessibility + sectionScores.Console + sectionScores.Security) / 4,
    );

    // --- Create PDF ---
    const pdfPath = `./pdfs/audit-${Date.now()}.pdf`;
    await createPDF(sections, sectionScores, pdfPath);

    // --- Final Return ---
    return {
      overallScore: averageScore,
      sectionScores,
      sections,
      pdfPath,
    };
  } catch (error: any) {
    console.error('❌ Error auditing page:', error.message);
    throw new Error('Failed to audit the login page.');
  } finally {
    if (browser) await browser.close();
  }
};
