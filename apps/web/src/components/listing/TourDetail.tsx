'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { MediaMosaic } from './MediaMosaic';
import { BookingCard } from './BookingCard';
import { ReviewsSection } from './ReviewsSection';
import { useT } from '@/i18n/useT';

function formatDuration(mins: number) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h >= 24) {
    const d = Math.floor(h / 24);
    const rh = h % 24;
    return rh ? `${d}d ${rh}h` : `${d}d`;
  }
  return m ? `${h}h ${m}m` : `${h}h`;
}

function listingJsonLd(listing: any, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.shortDescription || listing.description,
    image: listing.images?.map((i: any) => i.url).slice(0, 3),
    brand: {
      '@type': 'Brand',
      name: 'Ethio Experiences',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: listing.priceFrom?.currency || 'ETB',
      price: listing.priceFrom?.amount || 0,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/listing/${listing.slug}`,
    },
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

export function TourDetail({ listing }: { listing: any }) {
  const t = useT();
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

  return (
    <>
      <main className="mx-auto max-w-6xl px-6 py-8 pb-32 md:pb-8">
        {/* JSON-LD structured data */}
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
            href={`/search?city=${encodeURIComponent(listing.city)}`}
            className="hover:text-ink"
          >
            {t('listing.explore')} {listing.city}
          </Link>
          <span>›</span>
          <span className="capitalize text-ink">{listing.category}</span>
        </nav>

        {/* Hero */}
        <div className="mb-6">
          {listing.isOriginal && (
            <span className="inline-block rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              {t('listing.original')}
            </span>
          )}
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
              {t('listing.provider')}:{' '}
              <span className="font-medium text-ink">Ethio Demo Vendor</span>
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
            <div className="grid grid-cols-2 gap-4 rounded-card border border-line p-5 text-sm md:grid-cols-4">
              <Fact
                label={t('listing.duration')}
                value={formatDuration(listing.durationMinutes)}
              />
              <Fact
                label={t('listing.groupSize')}
                value={`${t('listing.upTo')} ${listing.groupSize}`}
              />
              <Fact
                label={t('listing.languages')}
                value={listing.languages.map((l: string) => l.toUpperCase()).join(', ')}
              />
              <Fact label={t('listing.category')} value={listing.category} />
            </div>

            <SectionHeading>{t('listing.about')}</SectionHeading>
            <p className="text-[15px] leading-relaxed text-body">
              {listing.description}
            </p>

            {listing.highlights?.length > 0 && (
              <>
                <SectionHeading>{t('listing.highlights')}</SectionHeading>
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

            {listing.included?.length > 0 && (
              <>
                <SectionHeading>{t('listing.included')}</SectionHeading>
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
                <SectionHeading>{t('listing.notIncluded')}</SectionHeading>
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

            {listing.meetingPoint?.name && (
              <>
                <SectionHeading>{t('listing.meeting')}</SectionHeading>
                <p className="text-[15px] text-body">
                  <strong className="text-ink">{listing.meetingPoint.name}</strong>
                  {listing.meetingPoint.address && (
                    <>
                      <br />
                      {listing.meetingPoint.address}
                    </>
                  )}
                </p>
              </>
            )}

            <SectionHeading>{t('listing.cancellation')}</SectionHeading>
            <p className="text-[15px] text-body">
              {policyLabel(listing.cancellationPolicy)}
            </p>
          </div>

          <BookingCard listing={listing} />
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
            <p className="text-[10px] uppercase tracking-wide text-muted">
              {t('listing.from')}
            </p>
            <p className="text-lg font-bold text-ink">
              {listing.priceFrom.currency} {listing.priceFrom.amount.toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={onMobileBook}
            className="rounded-pill bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            {t('listing.bookNow')}
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