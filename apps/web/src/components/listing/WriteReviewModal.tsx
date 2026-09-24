'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export function WriteReviewModal({
  bookingId,
  listingTitle,
  open,
  onClose,
  onSuccess,
}: {
  bookingId?: string;
  listingTitle: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) {
      toast.error('No eligible booking found');
      return;
    }
    setBusy(true);
    try {
      await api.post('/reviews', { bookingId, rating, title, text });
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || 'Failed to submit review');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-card bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-ink">Write a review</h2>
            <p className="mt-1 line-clamp-1 text-sm text-muted">{listingTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted hover:bg-surface"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Your rating
            </p>
            <div className="flex gap-1 text-3xl">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className={`transition ${
                    n <= (hover || rating) ? 'text-star' : 'text-line'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              Title (optional)
            </span>
            <input
              type="text"
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Amazing experience!"
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              Your review
            </span>
            <textarea
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell other travelers what you loved about this experience…"
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </label>

          <button
            type="submit"
            disabled={busy || text.length < 10}
            className="w-full rounded-pill bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-brand-blueHover disabled:opacity-50"
          >
            {busy ? 'Submitting…' : 'Submit review'}
          </button>
        </form>
      </div>
    </div>
  );
}