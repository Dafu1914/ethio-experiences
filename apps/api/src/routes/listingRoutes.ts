import { Router } from 'express';
import * as c from '../controllers/listingController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Public
router.get('/', c.listListings);
router.get('/:slug', c.getListing);

// Authenticated
router.get('/mine/all', requireAuth, requireRole('vendor', 'admin'), c.myListings);
router.post('/', requireAuth, requireRole('vendor', 'admin'), c.createListing);
router.patch('/:id', requireAuth, requireRole('vendor', 'admin'), c.updateListing);
router.delete('/:id', requireAuth, requireRole('vendor', 'admin'), c.deleteListing);

export default router;