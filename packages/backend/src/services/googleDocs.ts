import axios from 'axios';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Footer,
  PageNumber,
  ImageRun,
  Header,
  BorderStyle,
  WidthType,
  TableCell,
  TableRow,
  Table,
  VerticalAlign,
  HeightRule,
} from 'docx';
import { readFileSync } from 'fs';
import { resolve } from 'path';
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

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9_\-]/gi, '_');
}

function getUniqueFilePath(baseDir: string, baseName: string, ext: string): string {
  let version = 1;
  let filePath = path.join(baseDir, `${baseName}.${ext}`);

  while (fs.existsSync(filePath)) {
    version++;
    filePath = path.join(baseDir, `${baseName}_v${version}.${ext}`);
  }

  return filePath.toLowerCase();
}

function saveAsDocx(data: DocInput, content: string) {
  const today = new Date().toLocaleDateString('en-GB');
  const logoPath = resolve(__dirname, '../public/logo.png');
  const logoBuffer = readFileSync(logoPath);

  const borderless = {
    top: { size: 0, style: BorderStyle.NONE, color: 'FFFFFF' },
    bottom: { size: 0, style: BorderStyle.NONE, color: 'FFFFFF' },
    left: { size: 0, style: BorderStyle.NONE, color: 'FFFFFF' },
    right: { size: 0, style: BorderStyle.NONE, color: 'FFFFFF' },
  };

  const header = new Header({
    children: [
      new Table({
        width: { size: 9000, type: WidthType.DXA },
        columnWidths: [2000, 5600, 1400],
        alignment: AlignmentType.CENTER,
        rows: [
          new TableRow({
            cantSplit: true,
            height: {
              value: 600,
              rule: HeightRule.EXACT,
            },
            children: [
              new TableCell({
                width: { size: 1800, type: WidthType.DXA },
                borders: borderless,
                verticalAlign: VerticalAlign.BOTTOM,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                      new ImageRun({
                        data: logoBuffer,
                        type: 'png',
                        transformation: { width: 120, height: 40 },
                        altText: { name: 'gini-logo', title: 'gini-logo', description: 'gini-logo' },
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 5800, type: WidthType.DXA },
                borders: borderless,
                verticalAlign: VerticalAlign.BOTTOM,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 0 },
                    children: [new TextRun({ text: 'Gini-Apps', bold: true, size: 26 })],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 10, after: 0 },
                    children: [new TextRun({ text: data.projectName, bold: true, size: 28 })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 1400, type: WidthType.DXA },
                borders: borderless,
                verticalAlign: VerticalAlign.BOTTOM,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    spacing: { before: 0, after: 0 },
                    children: [new TextRun({ text: `Date: ${today}`, size: 22 })],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 0, after: 0 },
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
      new Paragraph({
        children: [],
        spacing: { after: 200 },
      }),
    ],
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

  // === Cover Page Section ===
  const coverSection = {
    headers: { default: header },
    footers: { default: footer },
    properties: {
      page: {
        margin: {
          top: 720,
          bottom: 720,
          left: 1440,
          right: 1440,
        },
      },
    },
    children: [
      // Reduced vertical padding to avoid extra page
      ...Array(6).fill(new Paragraph({ children: [], spacing: { after: 200 } })),

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
        spacing: { after: 200 },
      }),

      // === Spacer before version table ===
      new Paragraph({ children: [], spacing: { after: 200 } }),

      // === Centered Version Table with Padding ===
      new Table({
        width: { size: 8000, type: WidthType.DXA },
        columnWidths: [4000, 4000],
        alignment: AlignmentType.CENTER,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { fill: 'EDEDED' },
                margins: { top: 100, bottom: 100, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: 'Version', bold: true })],
                  }),
                ],
              }),
              new TableCell({
                shading: { fill: 'EDEDED' },
                margins: { top: 100, bottom: 100, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: 'Date', bold: true })],
                  }),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 100, bottom: 100, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: '1.0 - WIP' })],
                  }),
                ],
              }),
              new TableCell({
                margins: { top: 100, bottom: 100, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: today })],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  };

  // === Content Section ===
  const contentChildren: any[] = [];

  const parts = content.split(/\r?\n(?=Purpose|Architecture|Features)/);

  parts.forEach((part) => {
    const [sectionTitle, ...rest] = part.trim().split(/\r?\n/);
    const sectionContentLines = rest.join('\n').split(/\r?\n/);

    contentChildren.push(
      new Paragraph({
        text: sectionTitle,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 300 },
        pageBreakBefore: true,
      }),
    );

    sectionContentLines.forEach((line) => {
      if (line.startsWith('* ')) {
        contentChildren.push(
          new Paragraph({
            text: line.replace(/^\* /, ''),
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
        );
      } else if (line.trim()) {
        contentChildren.push(
          new Paragraph({
            text: line.trim(),
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),
        );
      }
    });
  });

  const contentSection = {
    headers: { default: header },
    footers: { default: footer },
    children: contentChildren,
  };

  const doc = new Document({
    sections: [coverSection, contentSection],
  });

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const sanitizedBaseName = sanitizeFileName(`${data.companyName}_${data.projectName}`);
  const fullPath = getUniqueFilePath(OUTPUT_DIR, sanitizedBaseName, 'docx');

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
