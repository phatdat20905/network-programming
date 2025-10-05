import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware cơ bản
app.use(cors());
app.use(express.json());

// Route test
app.get('/', (req, res) => {
  res.json({ message: '🚀 Server is running with ES Modules!' });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
