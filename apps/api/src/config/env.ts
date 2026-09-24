import 'dotenv/config';

const required = (k: string) => {
  const v = process.env[k];
  if (!v) throw new Error(`❌ Missing required env: ${k}`);
  return v;
};

const optional = (k: string, fallback = '') => process.env[k] || fallback;

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 4000,

  MONGO_URI: required('MONGO_URI'),
  JWT_ACCESS_SECRET: required('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),
  WEB_URL: required('WEB_URL'),

  RESEND_API_KEY: optional('RESEND_API_KEY'),
  FROM_EMAIL: optional('FROM_EMAIL', 'onboarding@resend.dev'),

  // Optional: comma-separated list of extra allowed origins
  CORS_ORIGINS: optional('CORS_ORIGINS'),

  // Public base URL of the API (used in emails, etc.)
  API_URL: optional('API_URL', 'http://localhost:4000'),
};

// Warn in production if any critical secret looks weak
if (env.NODE_ENV === 'production') {
  const weak = ['change-me', 'dev-', 'secret-'];
  for (const [k, v] of Object.entries({
    JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
  })) {
    if (weak.some((w) => v.toLowerCase().includes(w))) {
      console.warn(`⚠️  WARNING: ${k} looks like a dev value`);
    }
  }
}