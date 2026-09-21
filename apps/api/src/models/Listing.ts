import mongoose, { Schema, Document, Model } from 'mongoose';

export type ListingCategory =
  | 'tour'
  | 'trek'
  | 'culture'
  | 'festival'
  | 'wildlife'
  | 'stay'
  | 'transport';

export interface IListing extends Document {
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  category: ListingCategory;
  city: string;
  region: string;
  images: { url: string; alt: string }[];
  durationMinutes: number;
  groupSize: number;
  languages: string[];
  priceFrom: { amount: number; currency: 'ETB' | 'USD' | 'EUR' };
  rating: { avg: number; count: number };
  highlights: string[];
  included: string[];
  notIncluded: string[];
  meetingPoint?: {
    name: string;
    address: string;
    location?: { type: 'Point'; coordinates: [number, number] };
  };
  cancellationPolicy: '24h-free' | '48h-free' | 'non-refundable';
  urgencyBadge?: string;
  isOriginal: boolean;
  vendorId: mongoose.Types.ObjectId;
  status: 'draft' | 'pending' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    category: {
      type: String,
      enum: ['tour', 'trek', 'culture', 'festival', 'wildlife', 'stay', 'transport'],
      required: true,
      index: true,
    },
    city: { type: String, required: true, index: true },
    region: { type: String, required: true, index: true },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
      },
    ],
    durationMinutes: { type: Number, required: true, min: 1 },
    groupSize: { type: Number, default: 12, min: 1 },
    languages: { type: [String], default: ['en'] },
    priceFrom: {
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, enum: ['ETB', 'USD', 'EUR'], default: 'ETB' },
    },
    rating: {
      avg: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    highlights: { type: [String], default: [] },
    included: { type: [String], default: [] },
    notIncluded: { type: [String], default: [] },
    meetingPoint: {
      name: String,
      address: String,
      location: {
        type: { type: String, enum: ['Point'] },
        coordinates: [Number],
      },
    },
    cancellationPolicy: {
      type: String,
      enum: ['24h-free', '48h-free', 'non-refundable'],
      default: '24h-free',
    },
    urgencyBadge: String,
    isOriginal: { type: Boolean, default: false },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'archived'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

// Text search index
ListingSchema.index({ title: 'text', description: 'text', city: 'text', region: 'text' });

export const Listing: Model<IListing> =
  mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);