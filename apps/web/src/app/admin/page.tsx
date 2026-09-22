'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Stats = {
  users: number;
  vendors: number;
  admins: number;
  listings: number;
  pending: number;
  published: number;
  bookings: number;
  revenue: number;
};

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
    if (!authLoading && user && user.role !== 'admin') router.replace('/');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    (async () => {
      try {
        const data = await api.get('/admin/stats');
        setStats(data);
      } catch {}
      setLoading(false);
    })();
  }, [user]);

  if (authLoading || loading) {
    return <div className="p-20 text-center text-muted">Loading…</div>;
  }
  if (!user || !stats) return null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-extrabold text-ink">Admin dashboard</h1>
      <p className="mt-1 text-muted">Platform overview</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Users"
          value={stats.users}
          sub={`${stats.vendors} vendors · ${stats.admins} admins`}
        />
        <StatCard
          label="Listings"
          value={stats.listings}
          sub={`${stats.published} live · ${stats.pending} pending`}
          highlight={stats.pending > 0}
        />
        <StatCard label="Bookings" value={stats.bookings} sub="all time" />
        <StatCard
          label="Revenue"
          value={`${stats.revenue.toLocaleString()} ETB`}
          sub="confirmed"
        />
      </div>

      {stats.pending > 0 && (
        <div className="mt-6 rounded-card border border-[#FFE0B2] bg-[#FFF7E6] p-4 text-sm text-[#B26A00]">
          ⚠️ You have <strong>{stats.pending}</strong> listing
          {stats.pending > 1 ? 's' : ''} waiting for approval.{' '}
          <Link href="/admin/listings?status=pending" className="underline">
            Review now
          </Link>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-extrabold text-ink">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/listings?status=pending"
            className="rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            Review pending listings
          </Link>
          <Link
            href="/admin/listings"
            className="rounded-pill border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface"
          >
            All listings
          </Link>
          <Link
            href="/admin/users"
            className="rounded-pill border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface"
          >
            Users
          </Link>
          <Link
            href="/admin/bookings"
            className="rounded-pill border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface"
          >
            All bookings
          </Link>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: number | string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-card border bg-white p-5 ${
        highlight ? 'border-[#FFB84D]' : 'border-line'
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}