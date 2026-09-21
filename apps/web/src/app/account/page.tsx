'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) return <div className="p-20 text-muted">Loading…</div>;
  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-extrabold text-ink">My account</h1>
      <div className="mt-8 space-y-3 rounded-card border border-line p-6">
        <Row label="Name" value={user.name} />
        <Row label="Email" value={user.email} />
        <Row label="Role" value={user.role} />
        <Row label="Language" value={user.language.toUpperCase()} />
        <Row label="Currency" value={user.currency} />
        <Row label="Email verified" value={user.emailVerified ? 'Yes' : 'No'} />
      </div>

      <button
        onClick={async () => {
          await logout();
          router.push('/');
        }}
        className="mt-8 rounded-pill border border-line px-6 py-3 font-semibold text-ink hover:bg-surface"
      >
        Log out
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line pb-2 last:border-0">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}