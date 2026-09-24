'use client';

import Link from 'next/link';
import { useT } from '@/i18n/useT';
import { ListingCard, ListingCardData } from '@/components/ui/ListingCard';

export function HomeListings({
  listings,
  total,
}: {
  listings: ListingCardData[];
  total: number;
}) {
  const t = useT();

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-2xl font-extrabold text-ink">{t('home.popular')}</h2>
        <span className="text-sm text-muted">
          {total} {t('home.experiences')}
        </span>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-12 text-center">
          <div className="mb-3 text-5xl">🌍</div>
          <p className="font-semibold text-ink">{t('home.empty')}</p>
          <p className="mt-1 text-sm text-muted">{t('home.emptyHint')}</p>
          <Link
            href="/search"
            className="mt-5 inline-block rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            {t('home.browseAll')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l._id} listing={l} />
          ))}
        </div>
      )}

      {listings.length > 0 && (
        <div className="mt-10 text-center">
          <Link
            href="/search"
            className="inline-block rounded-pill border border-line px-6 py-3 text-sm font-semibold text-ink hover:bg-surface"
          >
            {t('home.viewAll')}
          </Link>
        </div>
      )}
    </section>
  );
}