import express from 'express';
import { generateProjectController, sendReportController, siteReviewController } from '../controllers/gptController';

const router = express.Router();

router.route('/generate').post(generateProjectController);
router.route('/review').post(siteReviewController);
router.route('/send-report').post(sendReportController);

export default router;


