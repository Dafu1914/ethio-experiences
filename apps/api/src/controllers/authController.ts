import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt';
import { sendVerification, sendReset } from '../utils/email';

const REFRESH_COOKIE = 'refresh_token';
const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (password.length < 8) return res.status(400).json({ error: 'Password too short' });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 12);
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    passwordHash,
    emailVerificationToken,
  });

  await sendVerification(user.email, emailVerificationToken);

  const access = signAccess(user.id, user.role);
  const refresh = signRefresh(user.id);
  user.refreshTokens = [refresh];
  await user.save();

  res.cookie(REFRESH_COOKIE, refresh, cookieOpts);
  res.status(201).json({ user: publicUser(user), accessToken: access });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select(
    '+passwordHash +refreshTokens'
  );
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const access = signAccess(user.id, user.role);
  const refresh = signRefresh(user.id);
  user.refreshTokens = [...(user.refreshTokens || []).slice(-4), refresh];
  await user.save();

  res.cookie(REFRESH_COOKIE, refresh, cookieOpts);
  res.json({ user: publicUser(user), accessToken: access });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  try {
    const { sub } = verifyRefresh(token);
    const user = await User.findById(sub).select('+refreshTokens');
    if (!user || !user.refreshTokens.includes(token))
      return res.status(401).json({ error: 'Refresh revoked' });

    const access = signAccess(user.id, user.role);
    res.json({ accessToken: access, user: publicUser(user) });
  } catch {
    res.status(401).json({ error: 'Invalid refresh' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    try {
      const { sub } = verifyRefresh(token);
      await User.updateOne({ _id: sub }, { $pull: { refreshTokens: token } });
    } catch {}
  }
  res.clearCookie(REFRESH_COOKIE, { path: '/' });
  res.json({ ok: true });
};

export const me = async (req: Request, res: Response) => {
  res.json({ user: publicUser(req.user!) });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    await sendReset(user.email, token);
  }
  res.json({ ok: true });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password || password.length < 8)
    return res.status(400).json({ error: 'Invalid input' });

  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  });
  if (!user) return res.status(400).json({ error: 'Token invalid or expired' });

  user.passwordHash = await bcrypt.hash(password, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = [];
  await user.save();

  res.json({ ok: true });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query as { token: string };
  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) return res.status(400).json({ error: 'Invalid token' });
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
  res.json({ ok: true });
};

function publicUser(u: any) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    language: u.language,
    currency: u.currency,
    emailVerified: u.emailVerified,
    wishlist: u.wishlist,
  };
}