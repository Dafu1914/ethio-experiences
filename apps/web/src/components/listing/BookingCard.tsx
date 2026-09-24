'use client';

import { useState } from 'react';
import { TrustRow } from './TrustRow';
import { SelectorRow } from './SelectorRow';
import { BookingModal, BookingModalListing } from './BookingModal';
import { useT } from '@/i18n/useT';

export type BookingListing = {
  _id: string;
  title: string;
  priceFrom: { amount: number; currency: string };
  urgencyBadge?: string;
  cancellationPolicy: string;
};

export function BookingCard({ listing }: { listing: BookingListing }) {
  const t = useT();
  const [modalOpen, setModalOpen] = useState(false);

  const modalListing: BookingModalListing = {
    _id: listing._id,
    title: listing.title,
    priceFrom: listing.priceFrom,
  };

  return (
    <>
      <aside className="rounded-card border border-line bg-white p-5 shadow-[0_4px_16px_rgba(10,26,47,0.06)] md:sticky md:top-24">
        {listing.urgencyBadge && (
          <span className="inline-block rounded bg-danger px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {listing.urgencyBadge}
          </span>
        )}

        <div className="mt-3">
          <p className="text-[13px] text-muted">{t('listing.from')}</p>
          <p className="text-[28px] font-bold leading-tight text-ink">
            {listing.priceFrom.currency} {listing.priceFrom.amount.toLocaleString()}
            <span className="ml-2 text-[13px] font-normal text-muted">
              {t('listing.perPerson')}
            </span>
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <SelectorRow
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
            label={`${t('booking.adults')} × 1`}
          />
          <SelectorRow
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            label={t('booking.date')}
          />
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-4 w-full rounded-pill bg-brand-blue py-3 text-base font-semibold text-white transition hover:bg-brand-blueHover"
        >
          {t('listing.bookNow')}
        </button>

        <div className="mt-5 space-y-3">
          <TrustRow
            title={t('listing.freeCancel')}
            body={t('listing.freeCancelBody')}
          />
          <TrustRow
            title={t('listing.payLater')}
            body={t('listing.payLaterBody')}
          />
        </div>
      </aside>

      <BookingModal listing={modalListing} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}