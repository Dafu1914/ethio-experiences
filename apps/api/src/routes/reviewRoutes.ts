import { Router } from 'express';
import * as c from '../controllers/reviewController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/listing/:slug', c.listListingReviews);

router.get('/mine', requireAuth, c.myReviews);
router.get('/eligible', requireAuth, c.eligibleBookings);
router.post('/', requireAuth, c.createReview);
router.delete('/:id', requireAuth, c.deleteReview);

export default router;