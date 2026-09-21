import { Router } from 'express';
import * as c from '../controllers/bookingController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, c.createBooking);
router.get('/mine', requireAuth, c.myBookings);
router.get('/public/:reference', c.getBookingPublic);
router.get('/:reference', requireAuth, c.getBooking);
router.patch('/:reference/cancel', requireAuth, c.cancelBooking);

export default router;