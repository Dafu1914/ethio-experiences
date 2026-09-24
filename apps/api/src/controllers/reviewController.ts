import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Booking } from '../models/Booking';
import { Listing } from '../models/Listing';

// Recompute listing.rating.avg and .count from all reviews
async function recalcListingRating(listingId: any) {
  const agg = await Review.aggregate([
    { $match: { listingId } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = agg[0] || {};
  await Listing.findByIdAndUpdate(listingId, {
    'rating.avg': Math.round(avg * 10) / 10,
    'rating.count': count,
  });
}

// POST /api/reviews
export const createReview = async (req: Request, res: Response) => {
  const user = req.user!;
  const { bookingId, rating, title, text } = req.body;

  if (!bookingId || !rating || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be 1-5' });
  }
  if (text.length < 10) {
    return res.status(400).json({ error: 'Review too short' });
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  // Only the traveler who booked can review
  if (booking.userId.toString() !== user._id.toString()) {
    return res.status(403).json({ error: 'Not your booking' });
  }

  // Only confirmed/completed bookings can be reviewed
  if (!['confirmed', 'completed'].includes(booking.status)) {
    return res.status(400).json({ error: 'Booking not eligible for review' });
  }

  // Prevent duplicates (unique index also catches, but give a friendly error)
  const existing = await Review.findOne({ bookingId: booking._id });
  if (existing) {
    return res.status(409).json({ error: 'You already reviewed this booking' });
  }

  const review = await Review.create({
    userId: user._id,
    listingId: booking.listingId,
    bookingId: booking._id,
    rating: Number(rating),
    title,
    text,
  });

  await recalcListingRating(booking.listingId);
  res.status(201).json({ review });
};

// GET /api/reviews/listing/:slug
export const listListingReviews = async (req: Request, res: Response) => {
  const listing = await Listing.findOne({ slug: req.params.slug });
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  const items = await Review.find({ listingId: listing._id })
    .sort({ createdAt: -1 })
    .populate('userId', 'name');

  // Rating breakdown
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  items.forEach((r) => {
    breakdown[r.rating as keyof typeof breakdown]++;
  });

  res.json({ items, breakdown, total: items.length });
};

// GET /api/reviews/mine
export const myReviews = async (req: Request, res: Response) => {
  const user = req.user!;
  const items = await Review.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .populate('listingId', 'title slug images city');
  res.json({ items });
};

// GET /api/reviews/eligible  — bookings user can still review
export const eligibleBookings = async (req: Request, res: Response) => {
  const user = req.user!;
  const bookings = await Booking.find({
    userId: user._id,
    status: { $in: ['confirmed', 'completed'] },
  })
    .sort({ date: -1 })
    .populate('listingId', 'title slug images city');

  const reviewed = await Review.find({ userId: user._id }).select('bookingId');
  const reviewedIds = new Set(reviewed.map((r) => r.bookingId.toString()));

  const eligible = bookings.filter((b) => !reviewedIds.has(b._id.toString()));
  res.json({ items: eligible });
};

// DELETE /api/reviews/:id
export const deleteReview = async (req: Request, res: Response) => {
  const user = req.user!;
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ error: 'Not found' });

  const isOwner = review.userId.toString() === user._id.toString();
  if (!isOwner && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await review.deleteOne();
  await recalcListingRating(review.listingId);
  res.json({ ok: true });
};