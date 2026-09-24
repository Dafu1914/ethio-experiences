import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import listingRoutes from './routes/listingRoutes';
import bookingRoutes from './routes/bookingRoutes';
import uploadRoutes from './routes/uploadRoutes';
import adminRoutes from './routes/adminRoutes';
import reviewRoutes from './routes/reviewRoutes';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.WEB_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
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