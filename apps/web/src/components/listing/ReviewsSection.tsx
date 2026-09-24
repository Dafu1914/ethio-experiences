'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { WriteReviewModal } from './WriteReviewModal';

type Review = {
  _id: string;
  rating: number;
  title?: string;
  text: string;
  createdAt: string;
  userId: { _id: string; name: string } | null;
};

type ApiResponse = {
  items: Review[];
  breakdown: { 1: number; 2: number; 3: number; 4: number; 5: number };
  total: number;
};

export function ReviewsSection({
  listingSlug,
  listingId,
  averageRating,
  reviewCount,
}: {
  listingSlug: string;
  listingId: string;
  averageRating: number;
  reviewCount: number;
}) {
  const { user } = useAuth();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [eligibleBooking, setEligibleBooking] = useState<any>(null);

  const load = async () => {
    try {
      const res = await api.get(`/reviews/listing/${listingSlug}`);
      setData(res);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingSlug]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { items } = await api.get('/reviews/eligible');
        const match = items.find(
          (b: any) => b.listingId?._id === listingId || b.listingId === listingId
        );
        setEligibleBooking(match || null);
      } catch {}
    })();
  }, [user, listingId]);

  const breakdown = data?.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const total = data?.total || 0;

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-xl font-extrabold text-ink">Reviews</h2>

      <div className="rounded-card border border-line bg-white p-5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="shrink-0 text-center">
            <div className="text-4xl font-extrabold text-ink">
              {averageRating ? averageRating.toFixed(1) : '—'}
            </div>
            <div className="mt-1 text-star">{renderStars(averageRating)}</div>
            <div className="mt-1 text-xs text-muted">
              {total} review{total !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = breakdown[star as keyof typeof breakdown] || 0;
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-muted">
                    {star} star{star > 1 ? 's' : ''}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                    <div className="h-full rounded-full bg-star" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-muted">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {user && eligibleBooking && (
          <div className="mt-5 border-t border-line pt-4">
            <p className="text-sm text-muted">
              You booked this experience. Share your thoughts!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
            >
              Write a review
            </button>
          </div>
        )}
        {user && !eligibleBooking && total === 0 && (
          <div className="mt-5 border-t border-line pt-4 text-sm text-muted">
            Be the first to review this experience.
          </div>
        )}
        {!user && (
          <div className="mt-5 border-t border-line pt-4 text-sm text-muted">
            <Link href="/login" className="text-brand-blue underline">
              Log in
            </Link>{' '}
            to leave a review.
          </div>
        )}
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted">Loading reviews…</p>
      ) : total === 0 ? (
        <p className="mt-6 text-sm italic text-muted">
          No reviews yet. Be the first to share your experience.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {data!.items.slice(0, 10).map((r) => (
            <div key={r._id} className="rounded-card border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                    {(r.userId?.name || 'U').charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {r.userId?.name || 'Traveler'}
                    </p>
                    <p className="text-xs text-muted">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-star">{renderStars(r.rating)}</span>
              </div>
              {r.title && <p className="mt-3 text-sm font-bold text-ink">{r.title}</p>}
              <p className="mt-2 text-sm leading-relaxed text-body">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      <WriteReviewModal
        bookingId={eligibleBooking?._id}
        listingTitle={eligibleBooking?.listingId?.title || ''}
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          load();
          toast.success('Thanks for your review!');
        }}
      />
    </div>
  );
}

function renderStars(rating: number) {
  const rounded = Math.round(rating);
  return Array.from({ length: 5 })
    .map((_, i) => (i < rounded ? '★' : '☆'))
    .join('');
}