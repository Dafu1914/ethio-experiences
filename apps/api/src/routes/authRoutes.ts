import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as c from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const router = Router();

router.post('/signup', limiter, c.signup);
router.post('/login', limiter, c.login);
router.post('/refresh', c.refresh);
router.post('/logout', c.logout);
router.post('/forgot-password', limiter, c.forgotPassword);
router.post('/reset-password', limiter, c.resetPassword);
router.get('/verify-email', c.verifyEmail);
router.get('/me', requireAuth, c.me);
router.post('/become-vendor', requireAuth, c.becomeVendor);
router.patch('/password', requireAuth, c.changePassword);

export default router;