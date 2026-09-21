import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const signAccess = (userId: string, role: string) =>
  jwt.sign({ sub: userId, role }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

export const signRefresh = (userId: string) =>
  jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

export const verifyAccess = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string; role: string };

export const verifyRefresh = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };