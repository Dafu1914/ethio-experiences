'use client';

import Link from 'next/link';
import { imageUrl } from '@/lib/api';

export type ListingCardData = {
  _id: string;
  slug: string;
  title: string;
  city: string;
  durationMinutes: number;
  priceFrom: { amount: number; currency: string };
  rating: { avg: number; count: number };
  images: { url: string; alt: string }[];
  urgencyBadge?: string;
  isOriginal?: boolean;
};

function formatDuration(mins: number) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h >= 24) {
    const d = Math.floor(h / 24);
    const rh = h % 24;
    return rh ? `${d} days ${rh}h` : `${d} days`;
  }
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const img = imageUrl(listing.images?.[0]?.url);

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group block overflow-hidden rounded-card border border-line bg-white transition hover:shadow-[0_6px_24px_rgba(10,26,47,0.10)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={listing.images[0].alt || listing.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted">
            No image
          </div>
        )}

        {listing.isOriginal && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-orange px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
            Original
          </span>
        )}

        <button
          type="button"
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink shadow transition hover:bg-white"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="space-y-1.5 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          From {listing.city}
        </p>

        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-ink group-hover:text-brand-blue">
          {listing.title}
        </h3>

        <p className="text-[13px] text-muted">{formatDuration(listing.durationMinutes)}</p>

        <div className="flex items-end justify-between pt-1">
          <span className="flex items-center gap-1 text-[13px] text-ink">
            <span className="text-star">★</span>
            <span className="font-semibold">{listing.rating.avg.toFixed(1)}</span>
            <span className="text-muted">({listing.rating.count})</span>
          </span>
          <span className="text-[13px] text-muted">
            From{' '}
            <span className="text-[15px] font-bold text-ink">
              {listing.priceFrom.currency} {listing.priceFrom.amount.toLocaleString()}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}