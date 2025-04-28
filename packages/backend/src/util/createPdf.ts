import PDFDocument from 'pdfkit';
import fs from 'fs';

export const createPDF = (sections: any, sectionScores: any, outputPath: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    doc.fontSize(26)
      .fillColor('#333')
      .text('Website Audit Report', { align: 'center' })
      .moveDown(2);

    Object.keys(sections).forEach(section => {
      const issues = sections[section];

      doc.fontSize(20)
        .fillColor('#4caf50')
        .text(`${section} Issues - Score: ${sectionScores[section]}/100`)
        .moveDown(1);

      if (issues.length === 0) {
        doc.fontSize(12)
          .fillColor('#999')
          .text('✅ No issues found.')
          .moveDown(2);
      } else {
        issues.forEach((issue: any, index: number) => {
          doc.fontSize(16)
            .fillColor('#4caf50')
            .text(`${index + 1}. ${issue.title}`)
            .moveDown(0.5);

          doc.fontSize(12)
            .fillColor('#ff6f61')
            .text(`Issue: ${issue.issue}`)
            .moveDown(0.3);

          doc.fontSize(12)
            .fillColor('#9acd32')
            .text(`Fix: ${issue.fix}`)
            .moveDown(0.3);

          doc.fontSize(12)
            .fillColor('#f0ad4e')
            .text(`Severity: ${issue.severity}`)
            .moveDown(1);

          // Separator
          doc.strokeColor('#ccc')
            .lineWidth(1)
            .moveTo(doc.page.margins.left, doc.y)
            .lineTo(doc.page.width - doc.page.margins.right, doc.y)
            .stroke()
            .moveDown(1);
        });
      }
    });

    doc.end();

    stream.on('finish', () => resolve());
    stream.on('error', err => reject(err));
  });
};
