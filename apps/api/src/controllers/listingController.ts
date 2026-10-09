import { Request, Response } from 'express';
import { Listing } from '../models/Listing';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// GET /api/listings
// Query: ?city=&category=&minPrice=&maxPrice=&sort=&q=&page=&limit=
export const listListings = async (req: Request, res: Response) => {
   const {
    city,
    category,
    type,
    minPrice,
    maxPrice,
    q,
    sort = 'popular',
    page = '1',
    limit = '12',
  } = req.query as Record<string, string>;

  const filter: any = { status: 'published' };
  if (city) filter.city = new RegExp(`^${city}$`, 'i');
  if (category) filter.category = category;
  if (type) filter.type = type;
  if (minPrice || maxPrice) {
    filter['priceFrom.amount'] = {};
    if (minPrice) filter['priceFrom.amount'].$gte = Number(minPrice);
    if (maxPrice) filter['priceFrom.amount'].$lte = Number(maxPrice);
  }
  if (q) filter.$text = { $search: q };

  const sortMap: Record<string, any> = {
    popular: { 'rating.count': -1 },
    rating: { 'rating.avg': -1 },
    priceAsc: { 'priceFrom.amount': 1 },
    priceDesc: { 'priceFrom.amount': -1 },
    newest: { createdAt: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Listing.find(filter).sort(sortMap[sort] || sortMap.popular).skip(skip).limit(Number(limit)),
    Listing.countDocuments(filter),
  ]);

  res.json({ items, total, page: Number(page), limit: Number(limit) });
};

// GET /api/listings/:slug
export const getListing = async (req: Request, res: Response) => {
  const listing = await Listing.findOne({ slug: req.params.slug }).populate(
    'vendorId',
    'name email'
  );
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  res.json({ listing });
};

// POST /api/listings (vendor only)
export const createListing = async (req: Request, res: Response) => {
  const user = req.user!;
  const body = req.body;

  if (!body.title || !body.description || !body.city || !body.region) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const baseSlug = slugify(body.title);
  let slug = baseSlug;
  let i = 2;
  while (await Listing.findOne({ slug })) {
    slug = `${baseSlug}-${i++}`;
  }

  const listing = await Listing.create({
    ...body,
    slug,
    vendorId: user._id,
    status: user.role === 'admin' ? 'published' : 'pending',
  });

  res.status(201).json({ listing });
};

// PATCH /api/listings/:id
export const updateListing = async (req: Request, res: Response) => {
  const user = req.user!;
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Not found' });

  const isOwner = listing.vendorId.toString() === user._id.toString();
  if (!isOwner && user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });

  Object.assign(listing, req.body);
  await listing.save();
  res.json({ listing });
};

// DELETE /api/listings/:id
export const deleteListing = async (req: Request, res: Response) => {
  const user = req.user!;
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Not found' });

  const isOwner = listing.vendorId.toString() === user._id.toString();
  if (!isOwner && user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });

  await listing.deleteOne();
  res.json({ ok: true });
};

// GET /api/listings/mine (vendor's own listings)
export const myListings = async (req: Request, res: Response) => {
  const user = req.user!;
  const items = await Listing.find({ vendorId: user._id }).sort({ createdAt: -1 });
  res.json({ items });
};