// Dev workaround for Windows schannel cert revocation issues
// (Kaspersky / Windows firewall blocking CRL lookups)
// Remove this in production — Linux servers don't have this problem.
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import { Resend } from 'resend';
import { env } from '../config/env';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const send = async (to: string, subject: string, html: string) => {
  if (!resend) {
    console.log(`[email-stub] to=${to} subject=${subject}`);
    return;
  }
  try {
    const result = await resend.emails.send({
      from: env.FROM_EMAIL,
      to,
      subject,
      html,
    });
    console.log(`[email] sent to=${to} subject="${subject}" id=${result.data?.id}`);
    return result;
  } catch (err: any) {
    console.error(`[email] FAILED to=${to}`, err?.message || err);
  }
};

// ─── Shared layout ────────────────────────────────
const layout = (body: string) => `
  <!doctype html>
  <html>
    <body style="margin:0;padding:0;background:#F7F8FA;font-family:Inter,Helvetica,Arial,sans-serif;color:#0A1A2F;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0"
              style="max-width:600px;background:#fff;border-radius:12px;border:1px solid #E5E8EC;overflow:hidden;">
              <tr>
                <td style="padding:20px 28px;border-bottom:1px solid #E5E8EC;">
                  <div style="font-size:18px;font-weight:800;color:#FF5533;letter-spacing:-0.02em;">
                    ETHIO EXPERIENCES
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:28px;">
                  ${body}
                </td>
              </tr>
              <tr>
                <td style="padding:20px 28px;border-top:1px solid #E5E8EC;font-size:12px;color:#6B7A90;text-align:center;">
                  © ${new Date().getFullYear()} Ethio Experiences · Addis Ababa, Ethiopia
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

const btn = (label: string, href: string) => `
  <a href="${href}" style="display:inline-block;background:#0A66FF;color:#fff;text-decoration:none;
     font-weight:600;font-size:14px;padding:12px 22px;border-radius:9999px;">${label}</a>
`;

// ─── Templates ────────────────────────────────────

export const sendVerification = (email: string, token: string) =>
  send(
    email,
    'Verify your email — Ethio Experiences',
    layout(`
      <h1 style="margin:0 0 12px;font-size:22px;color:#0A1A2F;">Welcome to Ethio Experiences</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1A2B49;">
        Thanks for signing up. Please confirm your email address to unlock all features.
      </p>
      <p style="margin:24px 0 0;">${btn('Verify email', `${env.WEB_URL}/verify-email?token=${token}`)}</p>
      <p style="margin:16px 0 0;font-size:12px;color:#6B7A90;">
        Or copy this link: ${env.WEB_URL}/verify-email?token=${token}
      </p>
    `)
  );

export const sendReset = (email: string, token: string) =>
  send(
    email,
    'Reset your password — Ethio Experiences',
    layout(`
      <h1 style="margin:0 0 12px;font-size:22px;color:#0A1A2F;">Reset your password</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1A2B49;">
        Click below to choose a new password. This link expires in 1 hour.
      </p>
      <p style="margin:24px 0 0;">${btn('Reset password', `${env.WEB_URL}/reset-password?token=${token}`)}</p>
    `)
  );

export const sendWelcome = (email: string, name: string) =>
  send(
    email,
    'Welcome to Ethio Experiences 🇪🇹',
    layout(`
      <h1 style="margin:0 0 12px;font-size:22px;color:#0A1A2F;">Welcome, ${name}! 🇪🇹</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1A2B49;">
        Thanks for joining Ethio Experiences — the easiest way to discover tours, treks, and
        cultural experiences across Ethiopia.
      </p>

      <div style="background:#F7F8FA;border-radius:10px;padding:16px;margin-bottom:20px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0A1A2F;">Here's what you can do:</p>
        <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;color:#1A2B49;">
          <li>Browse tours in Lalibela, Simien, Danakil, Omo Valley &amp; more</li>
          <li>Book instantly with instant confirmation</li>
          <li>Manage bookings from your account</li>
          <li>Become a vendor and list your own experiences</li>
        </ul>
      </div>

      <p style="margin:24px 0 0;">${btn('Start exploring', `${env.WEB_URL}/search`)}</p>
      <p style="margin:16px 0 0;font-size:12px;color:#6B7A90;">
        Questions? Just reply to this email — we read every message.
      </p>
    `)
  );

export const sendBookingConfirmation = (opts: {
  to: string;
  travelerName: string;
  reference: string;
  listingTitle: string;
  city: string;
  date: string;
  timeSlot?: string;
  participants: { adults: number; children: number };
  total: { amount: number; currency: string };
}) =>
  send(
    opts.to,
    `Booking confirmed — ${opts.reference}`,
    layout(`
      <h1 style="margin:0 0 12px;font-size:22px;color:#0A1A2F;">Your booking is confirmed 🎉</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#1A2B49;">
        Hi ${opts.travelerName}, we're excited to confirm your experience in Ethiopia.
      </p>

      <div style="background:#F7F8FA;border-radius:10px;padding:16px;margin-bottom:20px;">
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6B7A90;margin-bottom:4px;">
          Reference
        </div>
        <div style="font-family:monospace;font-size:18px;font-weight:700;color:#0A1A2F;">
          ${opts.reference}
        </div>
      </div>

      <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6B7A90;">
        Experience
      </p>
      <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#0A1A2F;">
        ${opts.listingTitle}
      </p>
      <p style="margin:0 0 16px;font-size:13px;color:#6B7A90;">📍 ${opts.city}</p>

      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;width:100%;">
        <tr>
          <td style="padding:6px 0;color:#6B7A90;">Date</td>
          <td style="padding:6px 0;text-align:right;color:#0A1A2F;font-weight:600;">${opts.date}</td>
        </tr>
        ${
          opts.timeSlot
            ? `
        <tr>
          <td style="padding:6px 0;color:#6B7A90;">Time</td>
          <td style="padding:6px 0;text-align:right;color:#0A1A2F;font-weight:600;">${opts.timeSlot}</td>
        </tr>`
            : ''
        }
        <tr>
          <td style="padding:6px 0;color:#6B7A90;">Participants</td>
          <td style="padding:6px 0;text-align:right;color:#0A1A2F;font-weight:600;">
            ${opts.participants.adults} adult${opts.participants.adults > 1 ? 's' : ''}${
      opts.participants.children
        ? `, ${opts.participants.children} child${opts.participants.children > 1 ? 'ren' : ''}`
        : ''
    }
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-top:1px solid #E5E8EC;font-weight:700;color:#0A1A2F;">Total</td>
          <td style="padding:10px 0;border-top:1px solid #E5E8EC;text-align:right;font-weight:700;color:#0A1A2F;">
            ${opts.total.currency} ${opts.total.amount.toLocaleString()}
          </td>
        </tr>
      </table>

      <p style="margin:24px 0 0;">${btn('View voucher', `${env.WEB_URL}/booking/${opts.reference}`)}</p>
      <p style="margin:16px 0 0;font-size:12px;color:#6B7A90;">
        Free cancellation up to 24 hours before the experience.
      </p>
    `)
  );

export const sendVendorNewBooking = (opts: {
  to: string;
  vendorName: string;
  reference: string;
  listingTitle: string;
  travelerName: string;
  date: string;
  total: { amount: number; currency: string };
}) =>
  send(
    opts.to,
    `New booking — ${opts.listingTitle}`,
    layout(`
      <h1 style="margin:0 0 12px;font-size:22px;color:#0A1A2F;">New booking received 🎉</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#1A2B49;">
        Hi ${opts.vendorName}, a traveler just booked your experience.
      </p>

      <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6B7A90;">
        Experience
      </p>
      <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#0A1A2F;">
        ${opts.listingTitle}
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;width:100%;">
        <tr>
          <td style="padding:6px 0;color:#6B7A90;">Reference</td>
          <td style="padding:6px 0;text-align:right;font-family:monospace;color:#0A1A2F;font-weight:600;">${opts.reference}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6B7A90;">Traveler</td>
          <td style="padding:6px 0;text-align:right;color:#0A1A2F;font-weight:600;">${opts.travelerName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6B7A90;">Date</td>
          <td style="padding:6px 0;text-align:right;color:#0A1A2F;font-weight:600;">${opts.date}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-top:1px solid #E5E8EC;font-weight:700;color:#0A1A2F;">Total</td>
          <td style="padding:10px 0;border-top:1px solid #E5E8EC;text-align:right;font-weight:700;color:#0A1A2F;">
            ${opts.total.currency} ${opts.total.amount.toLocaleString()}
          </td>
        </tr>
      </table>

      <p style="margin:24px 0 0;">${btn('View in dashboard', `${env.WEB_URL}/vendor/bookings`)}</p>
    `)
  );