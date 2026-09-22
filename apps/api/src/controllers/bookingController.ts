import { Request, Response } from 'express';
import crypto from 'crypto';
import { Booking } from '../models/Booking';
import { Listing } from '../models/Listing';

const makeRef = () =>
  'EE-' + crypto.randomBytes(3).toString('hex').toUpperCase();

// POST /api/bookings
export const createBooking = async (req: Request, res: Response) => {
  const user = req.user!;
  const {
    listingId,
    date,
    timeSlot,
    participants,
    contactName,
    contactEmail,
    contactPhone,
    notes,
  } = req.body;

  if (!listingId || !date || !contactName || !contactEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  const adults = Math.max(1, Number(participants?.adults) || 1);
  const children = Math.max(0, Number(participants?.children) || 0);
  const amount = listing.priceFrom.amount * adults;

  const booking = await Booking.create({
    reference: makeRef(),
    userId: user._id,
    listingId: listing._id,
    vendorId: listing.vendorId,
    date: new Date(date),
    timeSlot,
    participants: { adults, children },
    contactName,
    contactEmail,
    contactPhone,
    notes,
    total: { amount, currency: listing.priceFrom.currency },
    status: 'confirmed',
  });

  res.status(201).json({ booking });
};

// GET /api/bookings/mine   (traveler's own bookings)
export const myBookings = async (req: Request, res: Response) => {
  const user = req.user!;
  const items = await Booking.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .populate('listingId', 'title slug images city priceFrom');
  res.json({ items });
};

// GET /api/bookings/vendor/mine   (vendor's incoming bookings)
export const vendorBookings = async (req: Request, res: Response) => {
  const user = req.user!;
  const items = await Booking.find({ vendorId: user._id })
    .sort({ createdAt: -1 })
    .populate('listingId', 'title slug images city')
    .populate('userId', 'name email');
  res.json({ items });
};

// GET /api/bookings/public/:reference   (no auth — reference is the secret)
export const getBookingPublic = async (req: Request, res: Response) => {
  const booking = await Booking.findOne({ reference: req.params.reference }).populate(
    'listingId',
    'title slug images city durationMinutes meetingPoint'
  );
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json({ booking });
};

// GET /api/bookings/:reference   (auth required, owner or admin)
export const getBooking = async (req: Request, res: Response) => {
  const user = req.user!;
  const booking = await Booking.findOne({ reference: req.params.reference }).populate(
    'listingId',
    'title slug images city durationMinutes meetingPoint'
  );
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const isOwner = booking.userId.toString() === user._id.toString();
  if (!isOwner && user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });

  res.json({ booking });
};

// PATCH /api/bookings/:reference/cancel
export const cancelBooking = async (req: Request, res: Response) => {
  const user = req.user!;
  const booking = await Booking.findOne({ reference: req.params.reference });
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const isOwner = booking.userId.toString() === user._id.toString();
  const isVendor = booking.vendorId.toString() === user._id.toString();
  if (!isOwner && !isVendor && user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });

  if (booking.status === 'cancelled')
    return res.status(400).json({ error: 'Already cancelled' });

  booking.status = 'cancelled';
  await booking.save();

  res.json({ booking });
};