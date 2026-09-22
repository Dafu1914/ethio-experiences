import mongoose from 'mongoose';
import { env } from '../config/env';
import { Booking } from '../models/Booking';

async function clean() {
  await mongoose.connect(env.MONGO_URI);
  const res = await Booking.deleteMany({});
  console.log(`🗑️  Deleted ${res.deletedCount} bookings`);
  await mongoose.disconnect();
}

clean().catch(console.error);