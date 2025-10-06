import express from 'express';
import tagController from '../controllers/tagController.js';
import authMiddleware from '../middleware/auth.js';
import { paginationValidation, idParamValidation } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', paginationValidation, tagController.getAllTags);
router.get('/:id', idParamValidation, tagController.getTagById);
router.get('/slug/:slug', tagController.getTagBySlug);

// Protected routes - Admin only
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  tagController.createTag
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  tagController.updateTag
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  tagController.deleteTag
);

// Blog-tag relationships (Blog owner or Admin)
router.post(
  '/blog/:blogId',
  authMiddleware.authenticate,
  tagController.addTagsToBlog
);

router.delete(
  '/blog/:blogId/:tagId',
  authMiddleware.authenticate,
  tagController.removeTagFromBlog
);

export default router;