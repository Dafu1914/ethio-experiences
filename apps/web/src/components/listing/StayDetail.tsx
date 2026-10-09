'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { MediaMosaic } from './MediaMosaic';
import { StayBookingCard } from './StayBookingCard';
import { ReviewsSection } from './ReviewsSection';
import { useT } from '@/i18n/useT';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice } from '@/i18n/strings';

function listingJsonLd(listing: any, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: listing.title,
    description: listing.shortDescription || listing.description,
    image: listing.images?.map((i: any) => i.url).slice(0, 3),
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.city,
      addressRegion: listing.region,
      addressCountry: 'ET',
    },
    priceRange: `${listing.priceFrom?.currency} ${listing.priceFrom?.amount}`,
    aggregateRating:
      listing.rating?.count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: listing.rating.avg,
            reviewCount: listing.rating.count,
          }
        : undefined,
  };
}

export function StayDetail({ listing }: { listing: any }) {
  const t = useT();
  const { currency } = useLocale();
  const [copied, setCopied] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  const onMobileBook = () => {
    const aside = document.querySelector('aside');
    const btn = aside?.querySelector('button');
    if (btn) (btn as HTMLButtonElement).click();
  };

  const policyLabel = (p: string) => {
    if (p === '24h-free') return t('listing.freeCancel24');
    if (p === '48h-free') return t('listing.freeCancel48');
    return t('listing.nonRefundable');
  };

  const stay = listing.stay || {};
  const propertyTypeLabel = (() => {
    switch (stay.propertyType) {
      case 'hotel':
        return 'Hotel';
      case 'lodge':
        return 'Lodge';
      case 'guesthouse':
        return 'Guesthouse';
      case 'homestay':
        return 'Homestay';
      case 'camp':
        return 'Camp';
      default:
        return 'Stay';
    }
  })();

  return (
    <>
      <main className="mx-auto max-w-6xl px-6 py-8 pb-32 md:pb-8">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(listingJsonLd(listing, siteUrl)),
          }}
        />

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-ink">
            {t('listing.home')}
          </Link>
          <span>›</span>
          <Link
            href={`/search?city=${encodeURIComponent(listing.city)}&type=stay`}
            className="hover:text-ink"
          >
            Stays in {listing.city}
          </Link>
          <span>›</span>
          <span className="capitalize text-ink">{propertyTypeLabel}</span>
        </nav>

        {/* Hero */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              {propertyTypeLabel}
            </span>
            {listing.isOriginal && (
              <span className="inline-block rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                {t('listing.original')}
              </span>
            )}
          </div>
          <h1 className="mt-3 text-[28px] font-extrabold leading-tight text-ink md:text-[34px]">
            {listing.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
            <span className="flex items-center gap-1">
              <span className="text-star">★</span>
              <span className="font-semibold text-ink">
                {listing.rating.avg.toFixed(1)}
              </span>
              <span className="text-muted">
                ({listing.rating.count.toLocaleString()} {t('listing.reviewsCount')})
              </span>
            </span>
            <span className="text-muted">·</span>
            <span className="text-muted">
              📍 {listing.city}, {listing.region}
            </span>
            <div className="ml-auto flex items-center gap-4 text-brand-blue">
              <button className="flex items-center gap-1 hover:underline">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {t('listing.addWishlist')}
              </button>
              <button
                type="button"
                onClick={onShare}
                className="flex items-center gap-1 hover:underline"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                {copied ? '✓' : t('listing.share')}
              </button>
            </div>
          </div>
        </div>

        {/* Media mosaic */}
        <MediaMosaic images={listing.images} />

        {/* Body */}
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[1fr_380px]">
          <div>
            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-4 rounded-card border border-line p-5 text-sm md:grid-cols-4">
              {stay.maxGuests && <Fact label="Max guests" value={String(stay.maxGuests)} />}
              {stay.bedrooms !== undefined && (
                <Fact label="Bedrooms" value={String(stay.bedrooms)} />
              )}
              {stay.bathrooms !== undefined && (
                <Fact label="Bathrooms" value={String(stay.bathrooms)} />
              )}
              {stay.checkInTime && <Fact label="Check-in" value={stay.checkInTime} />}
              {stay.checkOutTime && <Fact label="Check-out" value={stay.checkOutTime} />}
            </div>

            <SectionHeading>About this stay</SectionHeading>
            <p className="text-[15px] leading-relaxed text-body">{listing.description}</p>

            {listing.highlights?.length > 0 && (
              <>
                <SectionHeading>Highlights</SectionHeading>
                <ul className="space-y-2 text-[15px] text-body">
                  {listing.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" />
                      {h}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Room types */}
            {stay.roomTypes?.length > 0 && (
              <>
                <SectionHeading>Room types</SectionHeading>
                <div className="space-y-3">
                  {stay.roomTypes.map((room: any, i: number) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-white p-4"
                    >
                      <div>
                        <p className="text-[15px] font-bold text-ink">{room.name}</p>
                        <p className="text-xs text-muted">
                          Sleeps up to {room.capacity} guest{room.capacity > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-ink">
                          {formatPrice(room.pricePerNight, currency)}
                        </p>
                        <p className="text-[10px] uppercase tracking-wide text-muted">
                          per night
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Amenities */}
            {stay.amenities?.length > 0 && (
              <>
                <SectionHeading>Amenities</SectionHeading>
                <div className="grid grid-cols-2 gap-2 text-[15px] text-body sm:grid-cols-3">
                  {stay.amenities.map((a: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-success">✓</span>
                      {a}
                    </div>
                  ))}
                </div>
              </>
            )}

            {listing.included?.length > 0 && (
              <>
                <SectionHeading>What&apos;s included</SectionHeading>
                <ul className="space-y-2 text-[15px] text-body">
                  {listing.included.map((h: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-success">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {listing.notIncluded?.length > 0 && (
              <>
                <SectionHeading>Not included</SectionHeading>
                <ul className="space-y-2 text-[15px] text-body">
                  {listing.notIncluded.map((h: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-danger">✕</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <SectionHeading>Location</SectionHeading>
            <p className="text-[15px] text-body">
              <strong className="text-ink">
                {listing.city}, {listing.region}
              </strong>
              <br />
              Ethiopia
            </p>

            <SectionHeading>Cancellation policy</SectionHeading>
            <p className="text-[15px] text-body">{policyLabel(listing.cancellationPolicy)}</p>
          </div>

          <StayBookingCard listing={listing} />
        </div>

        {/* Reviews */}
        <ReviewsSection
          listingSlug={listing.slug}
          listingId={listing._id}
          averageRating={listing.rating?.avg || 0}
          reviewCount={listing.rating?.count || 0}
        />
      </main>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-14 left-0 right-0 z-30 border-t border-line bg-white p-3 shadow-[0_-4px_16px_rgba(10,26,47,0.08)] md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted">From</p>
            <p className="text-lg font-bold text-ink">
              {formatPrice(listing.priceFrom.amount, currency)}
              <span className="ml-1 text-[10px] font-normal uppercase text-muted">
                / night
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onMobileBook}
            className="rounded-pill bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            Check availability
          </button>
        </div>
      </div>
    </>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-8 text-xl font-extrabold text-ink">{children}</h2>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-1 font-medium capitalize text-ink">{value}</p>
    </div>
  );
}