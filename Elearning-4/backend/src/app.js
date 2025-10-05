import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import apiResponse from './utils/apiResponse.js';
import errorHandler from './middleware/errorHandler.js';

// ES6 module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Import routes
// import authRoutes from './routes/auth.js';
// import blogRoutes from './routes/blog.js';
// import uploadRoutes from './routes/upload.js';

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  apiResponse.success(res, 'Server is running', { 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  apiResponse.error(res, 'Route not found', 404);
});

// Error handler
app.use(errorHandler);

export default app;