'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await signup(name, email, password);
      router.push('/');
    } catch (e: any) {
      setErr(e.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-extrabold text-ink">Create your account</h1>
      <p className="mt-2 text-muted">
        Join Ethio Experiences and start booking.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          type="text"
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-tile border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-brand-blue"
        />
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
          minLength={8}
          placeholder="Password (min 8 characters)"
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
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-blue underline">
          Log in
        </Link>
      </p>
    </div>
  );
}