'use client';

import { useState } from 'react';
import { TrustRow } from './TrustRow';
import { GuideBookingModal } from './GuideBookingModal';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice } from '@/i18n/strings';

export type GuideBookingListing = {
  _id: string;
  title: string;
  slug: string;
  priceFrom: { amount: number; currency: string };
  cancellationPolicy: string;
  urgencyBadge?: string;
  guide?: {
    specialties?: string[];
    yearsExperience?: number;
    dayRate?: number;
    maxGroupSize?: number;
    mode?: 'half-day' | 'full-day' | 'multi-day';
  };
};

export function GuideBookingCard({ listing }: { listing: GuideBookingListing }) {
  const { currency } = useLocale();
  const [modalOpen, setModalOpen] = useState(false);

  const dayRate = listing.guide?.dayRate || listing.priceFrom.amount;

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
            {formatPrice(dayRate, currency)}
            <span className="ml-2 text-[13px] font-normal text-muted">per day</span>
          </p>
        </div>

        {listing.guide?.specialties?.length ? (
          <div className="mt-4 rounded-tile bg-surface px-3 py-2 text-[12px]">
            <p className="text-[10px] uppercase tracking-wide text-muted">Specialties</p>
            <p className="font-semibold text-ink">
              {listing.guide.specialties.slice(0, 3).join(' · ')}
            </p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-4 w-full rounded-pill bg-brand-blue py-3 text-base font-semibold text-white transition hover:bg-brand-blueHover"
        >
          Book guide
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

      <GuideBookingModal
        listing={listing}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}