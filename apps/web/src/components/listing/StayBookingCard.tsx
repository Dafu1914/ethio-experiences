'use client';

import { useState } from 'react';
import { TrustRow } from './TrustRow';
import { StayBookingModal } from './StayBookingModal';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice } from '@/i18n/strings';

export type StayBookingListing = {
  _id: string;
  title: string;
  slug: string;
  priceFrom: { amount: number; currency: string };
  cancellationPolicy: string;
  urgencyBadge?: string;
  stay?: {
    roomTypes?: { name: string; pricePerNight: number; capacity: number }[];
    checkInTime?: string;
    checkOutTime?: string;
  };
};

export function StayBookingCard({ listing }: { listing: StayBookingListing }) {
  const { currency } = useLocale();
  const [modalOpen, setModalOpen] = useState(false);

  const rooms = listing.stay?.roomTypes || [];
  const cheapest = rooms.length
    ? Math.min(...rooms.map((r) => r.pricePerNight))
    : listing.priceFrom.amount;

  return (
    <>
      <aside className="rounded-card border border-line bg-white p-5 shadow-[0_4px_16px_rgba(10,26,47,0.06)] md:sticky md:top-24">
        {listing.urgencyBadge && (
          <span className="inline-block rounded bg-danger px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {listing.urgencyBadge}
          </span>
        )}

        <div className="mt-3">
          <p className="text-[13px] text-muted">From</p>
          <p className="text-[28px] font-bold leading-tight text-ink">
            {formatPrice(cheapest, currency)}
            <span className="ml-2 text-[13px] font-normal text-muted">per night</span>
          </p>
          {rooms.length > 0 && (
            <p className="mt-1 text-[12px] text-muted">
              {rooms.length} room type{rooms.length > 1 ? 's' : ''} available
            </p>
          )}
        </div>

        {listing.stay?.checkInTime && listing.stay?.checkOutTime && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
            <div className="rounded-tile bg-surface px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted">Check-in</p>
              <p className="font-semibold text-ink">{listing.stay.checkInTime}</p>
            </div>
            <div className="rounded-tile bg-surface px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted">Check-out</p>
              <p className="font-semibold text-ink">{listing.stay.checkOutTime}</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-4 w-full rounded-pill bg-brand-blue py-3 text-base font-semibold text-white transition hover:bg-brand-blueHover"
        >
          Check availability
        </button>

        <div className="mt-5 space-y-3">
          <TrustRow
            title="Free cancellation"
            body="Cancel up to 24 hours in advance for a full refund"
          />
          <TrustRow
            title="Reserve now & pay later"
            body="Keep your travel plans flexible — book your spot and pay nothing today"
          />
        </div>
      </aside>

      <StayBookingModal
        listing={listing}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}