import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import { 
  registerValidation, 
  loginValidation, 
  refreshTokenValidation, 
  logoutValidation 
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/refresh-token', refreshTokenValidation, authController.refreshToken);

// Protected routes
router.post('/logout', logoutValidation, authMiddleware.authenticate, authController.logout);
router.post('/logout-all', authMiddleware.authenticate, authController.logoutAll);
router.get('/me', authMiddleware.authenticate, authController.getMe);
router.get('/tokens', authMiddleware.authenticate, authController.getMyTokens);
router.post('/revoke-token', authMiddleware.authenticate, authController.revokeToken);

export default router;