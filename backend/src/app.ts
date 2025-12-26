import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes';
import verificationRoutes from './modules/verification/verification.routes';
import { feedRoutes } from './modules/feed/feed.routes';
import { userRoutes } from './modules/user/user.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/verification', verificationRoutes);
app.use('/feed', feedRoutes);
app.use('/users', userRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

export default app;
