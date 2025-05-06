import express from 'express';
import {
  docxFileController,
  generateProjectController,
  sendReportController,
  siteReviewController,
} from '../controllers/gptController';

const router = express.Router();

router.route('/generate').post(generateProjectController);
router.route('/review').post(siteReviewController);
router.route('/send-report').post(sendReportController);
router.route('/docx').post(docxFileController);

export default router;


