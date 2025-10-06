import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import { paginationValidation, idParamValidation } from '../middleware/validation.js';

const router = express.Router();

// Admin only routes
router.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  paginationValidation,
  userController.getAllUsers
);

router.get(
  '/stats',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  userController.getUserStats
);

router.get(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  idParamValidation,
  userController.getUserById
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  idParamValidation,
  userController.updateUser
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  idParamValidation,
  userController.deleteUser
);

router.patch(
  '/:id/active',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  idParamValidation,
  userController.toggleUserActive
);

router.patch(
  '/:id/role',
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  idParamValidation,
  userController.changeUserRole
);

export default router;