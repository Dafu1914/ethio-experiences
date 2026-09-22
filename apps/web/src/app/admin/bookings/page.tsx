'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Booking = {
  _id: string;
  reference: string;
  date: string;
  timeSlot?: string;
  status: string;
  total: { amount: number; currency: string };
  participants: { adults: number; children: number };
  contactName: string;
  contactEmail: string;
  listingId: { title: string; slug: string } | null;
  userId: { name: string; email: string } | null;
  vendorId: { name: string; email: string } | null;
};

export default function AdminBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
    if (!authLoading && user && user.role !== 'admin') router.replace('/');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    (async () => {
      try {
        const { items } = await api.get('/admin/bookings');
        setBookings(items);
      } catch {}
      setLoading(false);
    })();
  }, [user]);

  if (authLoading || loading) {
    return <div className="p-20 text-center text-muted">Loading…</div>;
  }
  if (!user) return null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">All bookings</h1>
          <p className="mt-1 text-muted">{bookings.length} total</p>
        </div>
        <Link href="/admin" className="text-sm font-medium text-brand-blue hover:underline">
          ← Admin dashboard
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-10 text-center">
          <p className="text-muted">No bookings yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">Traveler</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/booking/${b.reference}`}
                      className="font-mono text-xs font-semibold text-brand-blue hover:underline"
                    >
                      {b.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {b.listingId ? (
                      <Link
                        href={`/listing/${b.listingId.slug}`}
                        className="max-w-[200px] truncate hover:text-brand-blue"
                      >
                        {b.listingId.title}
                      </Link>
                    ) : (
                      <span className="italic text-muted">removed</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    <p className="font-medium text-ink">{b.contactName}</p>
                    <p className="text-xs">{b.contactEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {b.vendorId ? (
                      <>
                        <p className="font-medium text-ink">{b.vendorId.name}</p>
                        <p className="text-xs">{b.vendorId.email}</p>
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(b.date).toLocaleDateString()}
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

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'confirmed'
      ? 'bg-[#E7F6EE] text-[#12A150]'
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