'use client';

import { useState } from 'react';
import { TrustRow } from './TrustRow';
import { DriverBookingModal } from './DriverBookingModal';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice } from '@/i18n/strings';

export type DriverBookingListing = {
  _id: string;
  title: string;
  slug: string;
  priceFrom: { amount: number; currency: string };
  cancellationPolicy: string;
  urgencyBadge?: string;
  driver?: {
    vehicleType?: string;
    seats?: number;
    dailyRate?: number;
  };
};

export function DriverBookingCard({ listing }: { listing: DriverBookingListing }) {
  const { currency } = useLocale();
  const [modalOpen, setModalOpen] = useState(false);

  const dailyRate = listing.driver?.dailyRate || listing.priceFrom.amount;

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
            {formatPrice(dailyRate, currency)}
            <span className="ml-2 text-[13px] font-normal text-muted">per day</span>
          </p>
        </div>

        {listing.driver?.vehicleType && (
          <div className="mt-4 rounded-tile bg-surface px-3 py-2 text-[12px]">
            <p className="text-[10px] uppercase tracking-wide text-muted">Vehicle</p>
            <p className="font-semibold text-ink">
              {listing.driver.vehicleType}
              {listing.driver.seats ? ` · ${listing.driver.seats} seats` : ''}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-4 w-full rounded-pill bg-brand-blue py-3 text-base font-semibold text-white transition hover:bg-brand-blueHover"
        >
          Book driver
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

      <DriverBookingModal
        listing={listing}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}