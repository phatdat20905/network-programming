import express from 'express';
import categoryController from '../controllers/categoryController.js';
import authMiddleware from '../middleware/auth.js';
import { paginationValidation, idParamValidation } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', paginationValidation, categoryController.getAllCategories);
router.get('/:id', idParamValidation, categoryController.getCategoryById);

// Admin only routes
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  categoryController.createCategory
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  categoryController.deleteCategory
);

export default router;