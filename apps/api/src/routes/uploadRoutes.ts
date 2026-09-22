import { Router } from 'express';
import { upload } from '../middleware/upload';
import { uploadImages } from '../controllers/uploadController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.post(
  '/',
  requireAuth,
  requireRole('vendor', 'admin'),
  upload.array('images', 8),
  uploadImages
);

export default router;