import { Router } from 'express';
import authRoutes from './auth.js';
import blogRoutes from './blog.js';
import uploadRoutes from './upload.js';
import categoryRoutes from './category.js';
import tagRoutes from './tag.js';
import userRoutes from './user.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/upload', uploadRoutes);
router.use('/categories', categoryRoutes);
router.use('/api/tags', tagRoutes); 
router.use('/api/admin/users', userRoutes); 

export default router;