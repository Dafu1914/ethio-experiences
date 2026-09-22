import { Request, Response } from 'express';

export const uploadImages = async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length === 0) return res.status(400).json({ error: 'No files uploaded' });

  const urls = files.map((f) => `/uploads/${f.filename}`);
  res.json({ urls });
};