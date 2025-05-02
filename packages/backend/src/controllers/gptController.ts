import { Request, Response } from 'express';
import { generateProject } from '../services/generateProject';
import { reviewLoginPageFromUrl } from '../services/reviewLoginPageFromUrl';
import { sendAuditReport } from '../services/sendAuditReport';

export const generateProjectController = async (req: Request, res:Response):Promise<any>=> {
  const formData = req.body as FormData;

  try {
    const html = await generateProject(formData);
    res.status(200).send(html);
  } catch (err) {
    console.error('Generation failed:', err);
    res.status(500).json({ error: 'Failed to generate HTML' });
  }
};

export const siteReviewController = async (req: Request, res:Response) => {
  const { siteUrl } = req.body;
  console.log(siteUrl);

  if (!siteUrl) {
    return res.status(400).json({ error: 'Invalid input. Please provide a valid site url.' });
  }
  try {
    const review = await reviewLoginPageFromUrl(siteUrl);
    return res.status(200).send(review);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to apply features to HTML' });
  }
};

export const sendReportController = async (req: Request, res: Response) => {
  try {
    const { toEmail, pdfPath } = req.body;
    if (!toEmail || !pdfPath) {
      return res.status(400).json({ error: 'toEmail and pdfPath are required' });
    }

    await sendAuditReport(toEmail, pdfPath);

    res.status(200).json({ success: true, message: 'Report sent successfully' });
  } catch (error: any) {
    console.error('❌ Error sending report:', error.message);
    res.status(500).json({ error: 'Failed to send report' });
  }
};
