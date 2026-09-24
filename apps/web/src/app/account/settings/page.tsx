'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [user, authLoading, router]);

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    if (newPassword.length < 8) {
      setErr('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErr('Passwords do not match');
      return;
    }
    if (newPassword === currentPassword) {
      setErr('New password must be different from current');
      return;
    }

    setBusy(true);
    try {
      await api.patch('/auth/password', { currentPassword, newPassword });
      toast.success('Password changed. Please log in again.');

      // Log out because refresh tokens were cleared on the server
      setTimeout(async () => {
        await logout();
        router.push('/login');
      }, 1200);
    } catch (e: any) {
      setErr(e.message || 'Failed to change password');
      toast.error(e.message || 'Failed to change password');
    } finally {
      setBusy(false);
    }
  };

  if (authLoading) {
    return <div className="p-20 text-center text-muted">Loading…</div>;
  }
  if (!user) return null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-ink">Account settings</h1>
        <Link href="/account" className="text-sm font-medium text-brand-blue hover:underline">
          ← Back to account
        </Link>
      </div>

      {/* Profile summary */}
      <div className="rounded-card border border-line bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Signed in as</p>
        <p className="mt-1 text-base font-semibold text-ink">{user.name}</p>
        <p className="text-sm text-muted">{user.email}</p>
        <p className="mt-2 inline-block rounded-pill bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted">
          {user.role}
        </p>
      </div>

      {/* Change password */}
      <div className="mt-6 rounded-card border border-line bg-white p-5">
        <h2 className="mb-4 text-lg font-extrabold text-ink">Change password</h2>

        {err && (
          <div className="mb-4 rounded-tile border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
            {err}
          </div>
        )}

        <form onSubmit={onChangePassword} className="space-y-4">
          <Field label="Current password">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </Field>

          <Field label="New password (min 8 characters)">
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </Field>

          <Field label="Confirm new password">
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </Field>

          <button
            type="submit"
            disabled={busy || !currentPassword || !newPassword || !confirmPassword}
            className="rounded-pill bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blueHover disabled:opacity-50"
          >
            {busy ? 'Updating…' : 'Change password'}
          </button>

          <p className="text-xs text-muted">
            You&apos;ll be logged out of all sessions after changing your password.
          </p>
        </form>
      </div>

      {/* Danger zone (placeholder for future) */}
      <div className="mt-6 rounded-card border border-line bg-white p-5">
        <h2 className="mb-2 text-lg font-extrabold text-ink">Sessions</h2>
        <p className="text-sm text-muted">
          Changing your password logs you out everywhere. For extra security, use the{' '}
          <Link href="/login" className="text-brand-blue underline">
            Log in
          </Link>{' '}
          page to sign back in.
        </p>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}