import { Router } from 'express';
import * as c from '../controllers/adminController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Every /api/admin/* route requires auth + admin role
router.use(requireAuth, requireRole('admin'));

router.get('/stats', c.stats);

router.get('/listings', c.listListings);
router.patch('/listings/:id/status', c.updateListingStatus);
router.delete('/listings/:id', c.deleteListing);

router.get('/users', c.listUsers);
router.patch('/users/:id/role', c.updateUserRole);

router.get('/bookings', c.listBookings);

export default router;