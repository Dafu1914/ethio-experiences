import bookingRoutes from './routes/bookingRoutes';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import listingRoutes from './routes/listingRoutes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.WEB_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.get('/health', (_req, res) => res.json({ ok: true }));

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(env.PORT, () => console.log(`🚀 API on http://localhost:${env.PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed', err);
    process.exit(1);
  });