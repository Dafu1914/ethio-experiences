import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  rating: number;   // 1-5
  title?: string;
  text: string;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    listingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true, // one review per booking
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 120 },
    text: { type: String, required: true, minlength: 10, maxlength: 2000 },
    photos: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);