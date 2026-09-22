'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function BecomeAVendorPage() {
  const { user, loading, refresh } = useAuth() as any;
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/login?next=/become-a-vendor');
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-20 text-center text-muted">Loading…</div>;
  }

  const onUpgrade = async () => {
    setBusy(true);
    setErr('');
    try {
      await api.post('/auth/become-vendor');
      // force reload so AuthContext picks up the new role
      window.location.href = '/vendor';
    } catch (e: any) {
      setErr(e.message || 'Upgrade failed');
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-extrabold text-ink">Become a vendor</h1>
      <p className="mt-2 text-muted">
        List your Ethiopian tours, treks, and experiences on Ethio Experiences. Reach travelers
        worldwide and manage bookings in one dashboard.
      </p>

      <div className="mt-8 space-y-4 rounded-card border border-line p-6">
        <Bullet>Create unlimited listings with photos, pricing, and availability.</Bullet>
        <Bullet>See all bookings for your tours in real time.</Bullet>
        <Bullet>Get paid after each completed tour.</Bullet>
        <Bullet>Reach travelers from around the world looking for authentic Ethiopian experiences.</Bullet>
      </div>

      {user.role === 'vendor' || user.role === 'admin' ? (
        <div className="mt-8 rounded-card border border-line bg-surface p-6 text-center">
          <p className="text-ink">You&apos;re already a vendor.</p>
          <a
            href="/vendor"
            className="mt-4 inline-block rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            Go to dashboard
          </a>
        </div>
      ) : (
        <>
          {err && <p className="mt-6 text-sm text-danger">{err}</p>}
          <button
            onClick={onUpgrade}
            disabled={busy}
            className="mt-8 w-full rounded-pill bg-brand-blue py-3 font-semibold text-white hover:bg-brand-blueHover disabled:opacity-50"
          >
            {busy ? 'Upgrading…' : 'Become a vendor'}
          </button>
          <p className="mt-3 text-xs text-muted">
            Free to join. You only pay when you make a sale.
          </p>
        </>
      )}
    </main>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="text-success">✓</span>
      <span className="text-sm text-body">{children}</span>
    </div>
  );
}