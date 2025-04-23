import express from 'express';
import { generateProjectController, siteReviewController } from '../controllers/gptController';

const router = express.Router();

router.route('/generate').post(generateProjectController);
router.route('/review').post(siteReviewController);


export default router;


