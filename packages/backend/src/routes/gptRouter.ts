import express from 'express';
import { generateProjectController } from '../controllers/gptController';

const router = express.Router();

router.route('/generate').get(generateProjectController);

export default router;


