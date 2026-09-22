import { Request, Response } from 'express';
import { Listing } from '../models/Listing';
import { Booking } from '../models/Booking';
import { User } from '../models/User';

// GET /api/admin/stats
export const stats = async (_req: Request, res: Response) => {
  const [users, vendors, admins, listings, pending, published, bookings] =
    await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'vendor' }),
      User.countDocuments({ role: 'admin' }),
      Listing.countDocuments({}),
      Listing.countDocuments({ status: 'pending' }),
      Listing.countDocuments({ status: 'published' }),
      Booking.countDocuments({}),
    ]);

  const revenueAgg = await Booking.aggregate([
    { $match: { status: { $in: ['confirmed', 'completed'] } } },
    { $group: { _id: null, total: { $sum: '$total.amount' } } },
  ]);
  const revenue = revenueAgg[0]?.total || 0;

  res.json({
    users,
    vendors,
    admins,
    listings,
    pending,
    published,
    bookings,
    revenue,
  });
};

// GET /api/admin/listings?status=pending&q=search
export const listListings = async (req: Request, res: Response) => {
  const { status, q } = req.query as Record<string, string>;
  const filter: any = {};
  if (status && status !== 'all') filter.status = status;
  if (q) filter.title = new RegExp(q, 'i');

  const items = await Listing.find(filter)
    .sort({ createdAt: -1 })
    .populate('vendorId', 'name email');
  res.json({ items });
};

// PATCH /api/admin/listings/:id/status
export const updateListingStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['draft', 'pending', 'published', 'archived'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Not found' });
  listing.status = status;
  await listing.save();
  res.json({ listing });
};

// DELETE /api/admin/listings/:id
export const deleteListing = async (req: Request, res: Response) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};

// GET /api/admin/users
export const listUsers = async (_req: Request, res: Response) => {
  const items = await User.find({})
    .sort({ createdAt: -1 })
    .select('name email role emailVerified createdAt');
  res.json({ items });
};

// PATCH /api/admin/users/:id/role   { role }
export const updateUserRole = async (req: Request, res: Response) => {
  const { role } = req.body;
  if (!['traveler', 'vendor', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select(
    'name email role emailVerified createdAt'
  );
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ user });
};

// GET /api/admin/bookings
export const listBookings = async (_req: Request, res: Response) => {
  const items = await Booking.find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .populate('listingId', 'title slug city')
    .populate('userId', 'name email')
    .populate('vendorId', 'name email');
  res.json({ items });
};