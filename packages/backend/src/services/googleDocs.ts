import axios from 'axios';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Footer,
  TableOfContents,
  PageNumber,
  PageBreak,
  Numbering,
  LevelFormat, FileChild,
} from 'docx';
import * as fs from 'fs';
import * as path from 'path';

interface DocInput {
  companyName: string;
  projectName: string;
  description: string;
}

const MODEL_NAME = 'docs-genrator-bot';
const OUTPUT_DIR = './output';
const FILE_NAME = 'project_document.docx';

async function generateWithOllama(data: DocInput): Promise<string> {
  const prompt = JSON.stringify({
    companyName: data.companyName,
    projectName: data.projectName,
    description: data.description,
  });

  const response = await axios.post('http://localhost:11434/api/generate', {
    model: MODEL_NAME,
    prompt,
    stream: false,
  });

  return response.data.response;
}

function saveAsDocx(data: DocInput, content: string) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            children: ['Page ', PageNumber.CURRENT],
          }),
        ],
      }),
    ],
  });

  const children: FileChild[] = [];

  // Cover Page
  children.push(
    new Paragraph({
      children: [new TextRun({ text: data.companyName, bold: true, size: 48 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
    new Paragraph({
      children: [new TextRun({ text: data.projectName, size: 36 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: today, color: '888888', size: 24 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 500 },
    }),
  );

  // Section Parsing
  const parts = content.split(/\r?\n(?=Purpose|Architecture|Features)/);

  parts.forEach((part) => {
    const [sectionTitle, ...rest] = part.trim().split(/\r?\n/);
    const sectionContentLines = rest.join('\n').split(/\r?\n/);

    // Section Heading with page break
    children.push(
      new Paragraph({
        text: sectionTitle,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 300 },
        pageBreakBefore: true,
      }),
    );

    // Section content: paragraphs + bullets
    sectionContentLines.forEach((line) => {
      if (line.startsWith('* ')) {
        // Bullet point
        children.push(
          new Paragraph({
            text: line.replace(/^\* /, ''),
            bullet: {
              level: 0,
            },
            spacing: { after: 100 },
          }),
        );
      } else if (line.trim()) {
        children.push(
          new Paragraph({
            text: line.trim(),
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),
        );
      }
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        footers: { default: footer },
        children,
      },
    ],
  });

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
  const fullPath = path.join(OUTPUT_DIR, FILE_NAME);

  return Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(fullPath, buffer);
    return fullPath;
  });
}

export async function generateDocumentFile(data: DocInput): Promise<string> {
  try {
    const content = await generateWithOllama(data);
    const filePath = await saveAsDocx(data, content);
    console.log('✅ Document created at:', filePath);
    return filePath;
  } catch (err) {
    console.error('❌ Failed to create document:', err);
    throw err;
  }
}

// Example use
/*
generateDocumentFile({
  companyName: 'Gini Dev',
  projectName: 'AI Onboarding Assistant',
  description: 'This project automates onboarding for new developers using an AI-powered chat and document system.',
});
*/
