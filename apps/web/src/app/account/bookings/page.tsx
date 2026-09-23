'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api, imageUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Booking = {
  _id: string;
  reference: string;
  date: string;
  timeSlot?: string;
  participants: { adults: number; children: number };
  total: { amount: number; currency: string };
  status: string;
  listingId: {
    slug: string;
    title: string;
    city: string;
    images: { url: string; alt: string }[];
  } | null;
};

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { items } = await api.get('/bookings/mine');
        setBookings(items);
      } catch (e: any) {
        setError(e.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const cancelBooking = async (ref: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${ref}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b.reference === ref ? { ...b, status: 'cancelled' } : b))
      );
      toast.success('Booking cancelled');
    } catch (e: any) {
      toast.error(e.message || 'Failed to cancel');
    }
  };

  if (authLoading || loading) {
    return <div className="p-20 text-center text-muted">Loading…</div>;
  }

  if (!user) return null;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-ink">My bookings</h1>
        <Link href="/account" className="text-sm font-medium text-brand-blue hover:underline">
          ← Back to account
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}

      {bookings.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-10 text-center">
          <div className="mb-3 text-5xl">🎟️</div>
          <p className="font-semibold text-ink">No bookings yet</p>
          <p className="mt-1 text-sm text-muted">
            When you book experiences, they&apos;ll appear here.
          </p>
          <Link
            href="/search"
            className="mt-5 inline-block rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            Browse experiences
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="flex flex-col gap-4 rounded-card border border-line bg-white p-4 sm:flex-row"
            >
              {b.listingId?.slug ? (
                <Link
                  href={`/listing/${b.listingId.slug}`}
                  className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-tile bg-surface sm:w-40"
                >
                  {b.listingId.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl(b.listingId.images[0].url)}
                      alt={b.listingId.images[0].alt}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </Link>
              ) : (
                <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-tile bg-surface sm:w-40" />
              )}

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {b.listingId?.slug ? (
                        <Link
                          href={`/listing/${b.listingId.slug}`}
                          className="text-base font-bold text-ink hover:text-brand-blue"
                        >
                          {b.listingId.title}
                        </Link>
                      ) : (
                        <span className="text-base font-bold italic text-muted">
                          Listing removed
                        </span>
                      )}
                      {b.listingId?.city && (
                        <p className="text-xs text-muted">📍 {b.listingId.city}</p>
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        b.status === 'cancelled'
                          ? 'bg-danger/10 text-danger'
                          : 'bg-[#E7F6EE] text-[#12A150]'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[13px] text-muted sm:grid-cols-4">
                    <span>
                      <strong className="font-semibold text-ink">Date:</strong>{' '}
                      {new Date(b.date).toLocaleDateString()}
                    </span>
                    <span>
                      <strong className="font-semibold text-ink">Time:</strong>{' '}
                      {b.timeSlot || '—'}
                    </span>
                    <span>
                      <strong className="font-semibold text-ink">Ref:</strong>{' '}
                      <span className="font-mono">{b.reference}</span>
                    </span>
                    <span>
                      <strong className="font-semibold text-ink">Total:</strong>{' '}
                      {b.total.currency} {b.total.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/booking/${b.reference}`}
                    className="rounded-pill border border-line px-4 py-1.5 text-xs font-semibold text-ink hover:bg-surface"
                  >
                    View voucher
                  </Link>
                  {b.status !== 'cancelled' && (
                    <button
                      onClick={() => cancelBooking(b.reference)}
                      className="rounded-pill border border-line px-4 py-1.5 text-xs font-semibold text-danger hover:bg-surface"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}