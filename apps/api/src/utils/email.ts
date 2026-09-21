import { Resend } from 'resend';
import { env } from '../config/env';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const send = async (to: string, subject: string, html: string) => {
  if (!resend) {
    console.log(`[email-stub] to=${to} subject=${subject}`);
    return;
  }
  await resend.emails.send({ from: env.FROM_EMAIL, to, subject, html });
};

export const sendVerification = (email: string, token: string) =>
  send(
    email,
    'Verify your email',
    `<p>Click to verify: <a href="${env.WEB_URL}/verify-email?token=${token}">Verify</a></p>`
  );

export const sendReset = (email: string, token: string) =>
  send(
    email,
    'Reset your password',
    `<p>Click to reset: <a href="${env.WEB_URL}/reset-password?token=${token}">Reset</a></p>`
  );