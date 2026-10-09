'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchListings } from '@/lib/server-api';
import { ListingCard, ListingCardData } from '@/components/ui/ListingCard';
import { ListingGridSkeleton } from '@/components/ui/Skeleton';
import { useT } from '@/i18n/useT';

const CITIES = [
  'Addis Ababa',
  'Lalibela',
  'Gondar',
  'Axum',
  'Harar',
  'Bahir Dar',
  'Mekelle',
  'Jinka',
];

const CATEGORIES = [
  { val: 'tour', label: 'Tours' },
  { val: 'trek', label: 'Treks' },
  { val: 'culture', label: 'Culture' },
  { val: 'festival', label: 'Festivals' },
  { val: 'wildlife', label: 'Wildlife' },
  { val: 'stay', label: 'Stays' },
  { val: 'transport', label: 'Transport' },
];

const TYPES = [
  { val: '', label: 'All' },
  { val: 'tour', label: 'Tours' },
  { val: 'stay', label: 'Stays' },
  { val: 'driver', label: 'Drivers' },
  { val: 'guide', label: 'Guides' },
];

function SearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useT();

  const sp = useMemo(() => {
    return {
      city: searchParams.get('city') || '',
      category: searchParams.get('category') || '',
      type: searchParams.get('type') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      q: searchParams.get('q') || '',
      sort: searchParams.get('sort') || 'popular',
    };
  }, [searchParams]);

  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const query: Record<string, string> = { limit: '50' };
        if (sp.city) query.city = sp.city;
        if (sp.category) query.category = sp.category;
        if (sp.type) query.type = sp.type;
        if (sp.minPrice) query.minPrice = sp.minPrice;
        if (sp.maxPrice) query.maxPrice = sp.maxPrice;
        if (sp.q) query.q = sp.q;
        if (sp.sort) query.sort = sp.sort;

        const data = await fetchListings(query);
        setListings(data.items);
        setTotal(data.total);
      } catch {}
      setLoading(false);
    })();
  }, [sp]);

  const buildQs = (overrides: Record<string, string | undefined>) => {
    const merged: Record<string, string> = { ...sp, ...overrides } as any;
    const clean: Record<string, string> = {};
    Object.entries(merged).forEach(([k, v]) => {
      if (v) clean[k] = String(v);
    });
    return new URLSearchParams(clean).toString();
  };

  const push = (overrides: Record<string, string | undefined>) => {
    router.push(`/search?${buildQs(overrides)}`);
  };

  const isAll =
    !sp.city && !sp.category && !sp.type && !sp.minPrice && !sp.maxPrice && !sp.q;

  const sorts = [
    { val: 'popular', label: t('sort.popular') },
    { val: 'rating', label: t('sort.rating') },
    { val: 'priceAsc', label: t('sort.priceAsc') },
    { val: 'priceDesc', label: t('sort.priceDesc') },
    { val: 'newest', label: t('sort.newest') },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-ink">
          {sp.city ? `${t('search.inCity')} ${sp.city}` : t('search.title')}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {total} {t('search.results')}
        </p>

        {/* Type filter pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {TYPES.map((tp) => {
            const active = (sp.type || '') === tp.val;
            return (
              <button
                key={tp.val}
                onClick={() => push({ type: tp.val || undefined })}
                className={`rounded-pill px-4 py-1.5 text-sm font-semibold ${
                  active
                    ? 'bg-brand-blue text-white'
                    : 'border border-line text-ink hover:bg-surface'
                }`}
              >
                {tp.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          {!isAll && (
            <Link
              href="/search"
              className="mb-4 inline-block text-sm font-medium text-brand-blue hover:underline"
            >
              ← {t('search.clearAll')}
            </Link>
          )}

          <FilterGroup title={t('search.city')}>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => push({ city: undefined })}
                  className={`text-sm ${
                    !sp.city ? 'font-semibold text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {t('search.allCities')}
                </button>
              </li>
              {CITIES.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => push({ city: c })}
                    className={`text-sm ${
                      sp.city === c
                        ? 'font-semibold text-brand-blue'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </FilterGroup>

          <FilterGroup title={t('search.category')}>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => push({ category: undefined })}
                  className={`text-sm ${
                    !sp.category ? 'font-semibold text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {t('search.allCategories')}
                </button>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.val}>
                  <button
                    onClick={() => push({ category: c.val })}
                    className={`text-sm ${
                      sp.category === c.val
                        ? 'font-semibold text-brand-blue'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </FilterGroup>

          <FilterGroup title={t('search.price')}>
            <ul className="space-y-2">
              {[
                { label: t('search.anyPrice'), min: undefined, max: undefined },
                { label: 'Under 2,000', min: undefined, max: '2000' },
                { label: '2,000 – 5,000', min: '2000', max: '5000' },
                { label: '5,000 – 15,000', min: '5000', max: '15000' },
                { label: '15,000+', min: '15000', max: undefined },
              ].map((p) => {
                const active =
                  (sp.minPrice || '') === (p.min || '') &&
                  (sp.maxPrice || '') === (p.max || '');
                return (
                  <li key={p.label}>
                    <button
                      onClick={() => push({ minPrice: p.min, maxPrice: p.max })}
                      className={`text-sm ${
                        active ? 'font-semibold text-brand-blue' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {p.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </FilterGroup>
        </aside>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
            <span className="text-sm text-muted">
              {t('search.showing')} <strong className="text-ink">{listings.length}</strong>{' '}
              {t('search.of')} {total}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">{t('search.sortBy')}</span>
              <div className="flex flex-wrap gap-1">
                {sorts.map((s) => {
                  const active = sp.sort === s.val;
                  return (
                    <button
                      key={s.val}
                      onClick={() => push({ sort: s.val })}
                      className={`rounded-pill px-3 py-1 text-xs font-medium ${
                        active
                          ? 'bg-brand-blue text-white'
                          : 'border border-line text-muted hover:text-ink'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {loading ? (
            <ListingGridSkeleton count={4} />
          ) : listings.length === 0 ? (
            <div className="rounded-card border border-line bg-surface p-10 text-center">
              <p className="font-semibold text-ink">{t('search.noResults')}</p>
              <p className="mt-1 text-sm text-muted">{t('search.tryRemove')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {listings.map((l) => (
                <ListingCard key={l._id} listing={l} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={<div className="p-20 text-center text-muted">Loading…</div>}
    >
      <SearchInner />
    </Suspense>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 border-b border-line pb-5">
      <p className="mb-3 text-sm font-bold text-ink">{title}</p>
      {children}
    </div>
  );
}