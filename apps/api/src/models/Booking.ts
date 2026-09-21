import mongoose, { Schema, Document, Model } from 'mongoose';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'refunded';

export interface IBooking extends Document {
  reference: string;              // e.g. EE-A1B2C3
  userId: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  date: Date;                     // tour date
  timeSlot?: string;              // "09:00"
  participants: {
    adults: number;
    children: number;
  };
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  notes?: string;
  total: { amount: number; currency: 'ETB' | 'USD' | 'EUR' };
  status: BookingStatus;
  payment?: {
    provider: string;
    ref: string;
    paidAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    reference: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    listingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    timeSlot: String,
    participants: {
      adults: { type: Number, default: 1, min: 1 },
      children: { type: Number, default: 0, min: 0 },
    },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: String,
    notes: String,
    total: {
      amount: { type: Number, required: true },
      currency: { type: String, enum: ['ETB', 'USD', 'EUR'], default: 'ETB' },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
      default: 'confirmed',
      index: true,
    },
    payment: {
      provider: String,
      ref: String,
      paidAt: Date,
    },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);