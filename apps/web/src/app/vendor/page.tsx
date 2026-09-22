'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function VendorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ listings: 0, bookings: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
    if (!authLoading && user && user.role !== 'vendor' && user.role !== 'admin') {
      router.replace('/become-a-vendor');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) return;
    (async () => {
      try {
        const { items: listings } = await api.get('/listings/mine/all');
        const { items: bookings } = await api.get('/bookings/vendor/mine');

        const revenue = bookings
          .filter((b: any) => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum: number, b: any) => sum + b.total.amount, 0);

        setStats({
          listings: listings.length,
          bookings: bookings.length,
          revenue,
        });
      } catch {}
      setLoading(false);
    })();
  }, [user]);

  if (authLoading || loading) {
    return <div className="p-20 text-center text-muted">Loading…</div>;
  }
  if (!user) return null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-extrabold text-ink">Vendor dashboard</h1>
      <p className="mt-1 text-muted">Welcome back, {user.name}.</p>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Listings" value={stats.listings} href="/vendor/listings" />
        <StatCard label="Bookings" value={stats.bookings} href="/vendor/bookings" />
        <StatCard
          label="Revenue (ETB)"
          value={stats.revenue.toLocaleString()}
          href="/vendor/bookings"
        />
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="text-xl font-extrabold text-ink">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/vendor/listings/new"
            className="rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            + Create listing
          </Link>
          <Link
            href="/vendor/listings"
            className="rounded-pill border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface"
          >
            Manage listings
          </Link>
          <Link
            href="/vendor/bookings"
            className="rounded-pill border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface"
          >
            View bookings
          </Link>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-card border border-line bg-white p-5 transition hover:shadow-card"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    </Link>
  );
}