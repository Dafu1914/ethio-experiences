'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useT } from '@/i18n/useT';
import { ListingCard, ListingCardData } from '@/components/ui/ListingCard';

type Tab = 'all' | 'tour' | 'stay' | 'driver' | 'guide';

export function HomeListings({
  listings,
  total,
}: {
  listings: ListingCardData[];
  total: number;
}) {
  const t = useT();
  const [tab, setTab] = useState<Tab>('all');

  const filtered = useMemo(() => {
    if (tab === 'all') return listings;
    return listings.filter((l) => (l.type || 'tour') === tab);
  }, [listings, tab]);

  const counts = useMemo(
    () => ({
      all: listings.length,
      tour: listings.filter((l) => (l.type || 'tour') === 'tour').length,
      stay: listings.filter((l) => l.type === 'stay').length,
      driver: listings.filter((l) => l.type === 'driver').length,
      guide: listings.filter((l) => l.type === 'guide').length,
    }),
    [listings]
  );

  const browseHref =
    tab === 'stay'
      ? '/search?type=stay'
      : tab === 'driver'
      ? '/search?type=driver'
      : tab === 'guide'
      ? '/search?type=guide'
      : '/search';

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-extrabold text-ink">{t('home.popular')}</h2>
        <span className="text-sm text-muted">
          {total} {t('home.experiences')}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            { key: 'all', label: 'All' },
            { key: 'tour', label: 'Experiences' },
            { key: 'stay', label: 'Stays' },
            { key: 'driver', label: 'Drivers' },
            { key: 'guide', label: 'Guides' },
          ] as const
        ).map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`rounded-pill px-4 py-1.5 text-sm font-semibold ${
              tab === tb.key
                ? 'bg-brand-blue text-white'
                : 'border border-line text-ink hover:bg-surface'
            }`}
          >
            {tb.label}{' '}
            <span
              className={`ml-1 text-xs ${
                tab === tb.key ? 'text-white/80' : 'text-muted'
              }`}
            >
              ({counts[tb.key]})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-12 text-center">
          <div className="mb-3 text-5xl">🌍</div>
          <p className="font-semibold text-ink">
            {tab === 'stay'
              ? 'No stays yet'
              : tab === 'driver'
              ? 'No drivers yet'
              : tab === 'guide'
              ? 'No guides yet'
              : t('home.empty')}
          </p>
          <p className="mt-1 text-sm text-muted">
            {tab === 'stay'
              ? 'Check back soon for stays across Ethiopia.'
              : tab === 'driver'
              ? 'Check back soon for drivers across Ethiopia.'
              : tab === 'guide'
              ? 'Check back soon for local guides across Ethiopia.'
              : t('home.emptyHint')}
          </p>
          <Link
            href={browseHref}
            className="mt-5 inline-block rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            {t('home.browseAll')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <ListingCard key={l._id} listing={l} />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-10 text-center">
          <Link
            href={browseHref}
            className="inline-block rounded-pill border border-line px-6 py-3 text-sm font-semibold text-ink hover:bg-surface"
          >
            {t('home.viewAll')}
          </Link>
        </div>
      )}
    </section>
  );
}