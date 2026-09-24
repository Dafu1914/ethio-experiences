'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Review = {
  _id: string;
  rating: number;
  title?: string;
  text: string;
  createdAt: string;
  listingId: {
    _id: string;
    title: string;
    slug: string;
    city: string;
    images: { url: string; alt: string }[];
  } | null;
};

export default function MyReviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { items } = await api.get('/reviews/mine');
        setReviews(items);
      } catch {}
      setLoading(false);
    })();
  }, [user]);

  const onDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success('Review deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  if (authLoading || loading) {
    return <div className="p-20 text-center text-muted">Loading…</div>;
  }
  if (!user) return null;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-ink">My reviews</h1>
        <Link href="/account" className="text-sm font-medium text-brand-blue hover:underline">
          ← Back to account
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-10 text-center">
          <div className="mb-3 text-5xl">⭐</div>
          <p className="font-semibold text-ink">No reviews yet</p>
          <p className="mt-1 text-sm text-muted">
            After your next experience, share what you thought.
          </p>
          <Link
            href="/account/bookings"
            className="mt-5 inline-block rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            View my bookings
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="rounded-card border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  {r.listingId?.slug && (
                    <Link
                      href={`/listing/${r.listingId.slug}`}
                      className="h-16 w-24 shrink-0 overflow-hidden rounded-tile bg-surface"
                    >
                      {r.listingId.images?.[0]?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.listingId.images[0].url}
                          alt={r.listingId.images[0].alt}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </Link>
                  )}
                  <div>
                    <Link
                      href={`/listing/${r.listingId?.slug}`}
                      className="text-base font-bold text-ink hover:text-brand-blue"
                    >
                      {r.listingId?.title || 'Listing removed'}
                    </Link>
                    {r.listingId?.city && (
                      <p className="text-xs text-muted">📍 {r.listingId.city}</p>
                    )}
                    <p className="mt-1 text-xs text-muted">
                      Reviewed {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-star">
                    {Array.from({ length: 5 })
                      .map((_, i) => (i < r.rating ? '★' : '☆'))
                      .join('')}
                  </div>
                  <button
                    onClick={() => onDelete(r._id)}
                    className="mt-2 text-xs font-semibold text-danger hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {r.title && <p className="mt-3 text-sm font-bold text-ink">{r.title}</p>}
              <p className="mt-2 text-sm leading-relaxed text-body">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}