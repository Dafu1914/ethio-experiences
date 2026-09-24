'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { TableSkeleton } from '@/components/ui/Skeleton';

type Booking = {
  _id: string;
  reference: string;
  date: string;
  timeSlot?: string;
  participants: { adults: number; children: number };
  total: { amount: number; currency: string };
  status: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  listingId: {
    _id: string;
    slug: string;
    title: string;
    city: string;
    images: { url: string; alt: string }[];
  } | null;
  userId: { name: string; email: string } | null;
};

export default function VendorBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');

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
        const { items } = await api.get('/bookings/vendor/mine');
        setBookings(items);
      } catch (e: any) {
        setErr(e.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const filtered = useMemo(
    () => (filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter]
  );

  const totals = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === 'confirmed');
    const revenue = confirmed.reduce((s, b) => s + b.total.amount, 0);
    const travellers = confirmed.reduce(
      (s, b) => s + b.participants.adults + b.participants.children,
      0
    );
    return { revenue, travellers, count: confirmed.length };
  }, [bookings]);

  if (authLoading || loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-surface" />
        <TableSkeleton rows={6} />
      </main>
    );
  }
  if (!user) return null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Bookings</h1>
          <p className="mt-1 text-muted">
            {bookings.length} total · {totals.count} confirmed
          </p>
        </div>
        <Link href="/vendor" className="text-sm font-medium text-brand-blue hover:underline">
          ← Dashboard
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Confirmed bookings" value={totals.count} />
        <Stat label="Travelers" value={totals.travellers} />
        <Stat label="Revenue (ETB)" value={totals.revenue.toLocaleString()} />
      </div>

      <div className="mb-4 flex gap-2">
        {(['all', 'confirmed', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-pill px-4 py-1.5 text-xs font-semibold capitalize ${
              filter === f
                ? 'bg-brand-blue text-white'
                : 'border border-line text-muted hover:text-ink'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {err && <p className="mb-4 text-sm text-danger">{err}</p>}

      {filtered.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-10 text-center">
          <div className="mb-3 text-5xl">📭</div>
          <p className="font-semibold text-ink">No bookings yet</p>
          <p className="mt-1 text-sm text-muted">
            When travelers book your experiences, they&apos;ll appear here.
          </p>
          <Link
            href="/vendor/listings"
            className="mt-5 inline-block rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            View my listings
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">Traveler</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Participants</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {filtered.map((b) => (
                <tr key={b._id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/booking/${b.reference}`}
                      className="font-mono text-xs font-semibold text-brand-blue hover:underline"
                    >
                      {b.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {b.listingId ? (
                      <Link
                        href={`/listing/${b.listingId.slug}`}
                        className="block max-w-[220px] truncate font-medium text-ink hover:text-brand-blue"
                      >
                        {b.listingId.title}
                      </Link>
                    ) : (
                      <span className="italic text-muted">Listing removed</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{b.contactName}</p>
                    <p className="text-xs text-muted">{b.contactEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(b.date).toLocaleDateString()}
                    {b.timeSlot && <span className="ml-1 text-xs">· {b.timeSlot}</span>}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {b.participants.adults}A
                    {b.participants.children ? ` · ${b.participants.children}C` : ''}
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {b.total.currency} {b.total.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-card border border-line bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'confirmed' || status === 'completed'
      ? 'bg-[#E7F6EE] text-[#12A150]'
      : status === 'pending'
      ? 'bg-[#FFF7E6] text-[#B26A00]'
      : status === 'cancelled'
      ? 'bg-danger/10 text-danger'
      : 'bg-surface text-muted';
  return (
    <span
      className={`rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${cls}`}
    >
      {status}
    </span>
  );
}