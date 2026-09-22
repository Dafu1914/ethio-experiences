import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const uploadImages = async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length === 0) return res.status(400).json({ error: 'No files uploaded' });

  const urls = files.map((f) => `/uploads/${f.filename}`);
  res.json({ urls });
};