'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (e: any) {
      setErr(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-extrabold text-ink">Welcome back</h1>
      <p className="mt-2 text-muted">
        Log in to book Ethiopian experiences.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-tile border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-brand-blue"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-tile border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-brand-blue"
        />

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-pill bg-brand-blue py-3 font-semibold text-white transition hover:bg-brand-blueHover disabled:opacity-50"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <div className="mt-6 flex justify-between text-sm text-muted">
        <Link href="/forgot-password" className="text-brand-blue underline">
          Forgot password?
        </Link>
        <Link href="/signup" className="text-brand-blue underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}