import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Header,
  Footer,
  AlignmentType, BorderStyle,
} from 'docx';
import fs from 'fs';
import path from 'path';

export async function createDocFile(filename: string): Promise<string> {
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, filename);

  // --- HEADER ---
  const header = new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: 'Project Combina',
            bold: true,
            size: 32, // 32pt
          }),
        ],
      }),
      new Paragraph({
        border: {
          bottom: {
            color: '000000',
            space: 1,
            size: 6, // thickness
            style: BorderStyle.SINGLE, // ✅ correct key

          },
        },
      }),
    ],
  });

  // --- FOOTER ---
  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun('Arye Shenkar St 3, Herzliya  | Tel. +9729771-0302 |  www.gini-apps.com'),
        ],
      }),
    ],
  });

  // --- MAIN CONTENT ---
  const centerTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 3000, after: 200 },
    children: [
      new TextRun({
        text: 'Top Secret Project Combina',
        bold: true,
        size: 64,
      }),
    ],
  });

  const emptyLine = new Paragraph({
    spacing: { after: 200 },
  });

  const redWarning = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: 'Amit You Are Fired!! Amit',
        bold: true,
        color: '#FF0000',
        size: 64,
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        headers: { default: header },
        footers: { default: footer },
        children: [centerTitle, emptyLine, redWarning],

      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
  console.log('✅ File saved to:', filePath);
  return filePath;
}
