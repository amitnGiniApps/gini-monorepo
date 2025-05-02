import { sendEmailWithPDF } from './emailService';

export const sendAuditReport = async (toEmail: string, pdfPath: string) => {
  if (!pdfPath) throw new Error('PDF path not provided.');

  await sendEmailWithPDF(
    toEmail,
    'Website Audit Report',
    'Attached is your requested website audit report.',
    pdfPath,
  );
};
