import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes';
import verificationRoutes from './modules/verification/verification.routes';
import { feedRoutes } from './modules/feed/feed.routes';
import { userRoutes } from './modules/user/user.routes';
import { reportRoutes } from './modules/report/report.routes';
import path from 'path';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve static files (uploads)
// In production, use Nginx or S3
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/verification', verificationRoutes);
app.use('/feed', feedRoutes);
app.use('/users', userRoutes);
app.use('/reports', reportRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

export default app;
