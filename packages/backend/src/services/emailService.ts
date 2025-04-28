import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  pool: true,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER!,  // Your Gmail address
    pass: process.env.EMAIL_PASS!,  // Your regular Gmail password (not recommended)
  },
  tls: {
    rejectUnauthorized: false,  // Optional but might help with certain server configurations
  },
});

/**
 * Send an email with a PDF attachment
 * @param toEmail - Receiver email address
 * @param subject - Email subject
 * @param text - Email plain text body
 * @param pdfPath - Path to the PDF attachment
 */
export const sendEmailWithPDF = async (toEmail: string, subject: string, text: string, pdfPath: string) => {
  try {
    console.log('running');
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject,
      text,
      // attachments: [
      //   {
      //     filename: 'audit-report.pdf',
      //     path: pdfPath,
      //   },
      // ],
    });
    console.log('✅ Email sent successfully to', toEmail);
  } catch (error: any) {
    console.error('❌ Failed to send email:', error.message);
    throw new Error('Failed to send the audit report email.');
  }
};
