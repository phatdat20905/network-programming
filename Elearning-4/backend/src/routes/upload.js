import express from 'express';
import uploadController from '../controllers/uploadController.js';
import authMiddleware from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Protected routes
router.post(
  '/image',
  authMiddleware.authenticate,
  upload.single('image'),
  handleUploadError,
  uploadController.uploadImage
);

router.post(
  '/images',
  authMiddleware.authenticate,
  upload.array('images', 5), // Max 5 images
  handleUploadError,
  uploadController.uploadMultipleImages
);

export default router;