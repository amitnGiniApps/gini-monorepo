import { Request, Response } from 'express';
import { generateProject } from '../services/generateProject';

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
