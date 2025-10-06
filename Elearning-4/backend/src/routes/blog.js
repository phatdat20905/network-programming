import express from 'express';
import blogController from '../controllers/blogController.js';
import authMiddleware from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';
import { 
  blogValidation, 
  idParamValidation, 
  paginationValidation 
} from '../middleware/validation.js';
import Blog from '../models/Blog.js'; // ✅ Thêm dòng này

const router = express.Router();

// Public routes
router.get('/', paginationValidation, blogController.getAllBlogs);
router.get('/:id', idParamValidation, blogController.getBlogById);
router.get('/slug/:slug', blogController.getBlogBySlug);

// Protected routes
router.post(
  '/',
  authMiddleware.authenticate,
  upload.single('featured_image'),
  blogValidation,
  handleUploadError,
  blogController.createBlog
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.checkOwnership(Blog), // ✅ Đưa model Blog trực tiếp
  upload.single('featured_image'),
  blogValidation,
  handleUploadError,
  blogController.updateBlog
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.checkOwnership(Blog), // ✅ Không dùng require nữa
  blogController.deleteBlog
);

router.get(
  '/user/my-blogs',
  authMiddleware.authenticate,
  paginationValidation,
  blogController.getMyBlogs
);

export default router;
