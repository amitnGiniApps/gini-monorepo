import express from 'express';
import { generateProjectController } from '../controllers/gptController';

const router = express.Router();

router.route('/generate').post(generateProjectController);

export default router;


