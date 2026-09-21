import Link from 'next/link';
import { fetchListings } from '@/lib/server-api';
import { ListingCard, ListingCardData } from '@/components/ui/ListingCard';

export const dynamic = 'force-dynamic';

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

const SORTS = [
  { val: 'popular', label: 'Popular' },
  { val: 'rating', label: 'Top rated' },
  { val: 'priceAsc', label: 'Price: low to high' },
  { val: 'priceDesc', label: 'Price: high to low' },
  { val: 'newest', label: 'Newest' },
];

type SearchParams = {
  city?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
  sort?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const query: Record<string, string> = { limit: '50' };
  if (sp.city) query.city = sp.city;
  if (sp.category) query.category = sp.category;
  if (sp.minPrice) query.minPrice = sp.minPrice;
  if (sp.maxPrice) query.maxPrice = sp.maxPrice;
  if (sp.q) query.q = sp.q;
  if (sp.sort) query.sort = sp.sort;

  let listings: ListingCardData[] = [];
  let total = 0;
  try {
    const data = await fetchListings(query);
    listings = data.items;
    total = data.total;
  } catch {}

  const buildQs = (overrides: Partial<SearchParams>) => {
    const merged: Record<string, string> = { ...sp, ...overrides } as any;
    const clean: Record<string, string> = {};
    Object.entries(merged).forEach(([k, v]) => {
      if (v) clean[k] = String(v);
    });
    return new URLSearchParams(clean).toString();
  };

  const isAll = !sp.city && !sp.category && !sp.minPrice && !sp.maxPrice && !sp.q;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      {/* Header row */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-ink">
          {sp.city ? `Things to do in ${sp.city}` : 'All experiences'}
        </h1>
        <p className="mt-1 text-sm text-muted">{total} results</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="md:sticky md:top-24 md:self-start">
          {!isAll && (
            <Link
              href="/search"
              className="mb-4 inline-block text-sm font-medium text-brand-blue hover:underline"
            >
              ← Clear all filters
            </Link>
          )}

          {/* City */}
          <FilterGroup title="City">
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/search?${buildQs({ city: undefined })}`}
                  className={`text-sm ${
                    !sp.city ? 'font-semibold text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  All cities
                </Link>
              </li>
              {CITIES.map((c) => (
                <li key={c}>
                  <Link
                    href={`/search?${buildQs({ city: c })}`}
                    className={`text-sm ${
                      sp.city === c ? 'font-semibold text-brand-blue' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </FilterGroup>

          {/* Category */}
          <FilterGroup title="Category">
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/search?${buildQs({ category: undefined })}`}
                  className={`text-sm ${
                    !sp.category ? 'font-semibold text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  All categories
                </Link>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.val}>
                  <Link
                    href={`/search?${buildQs({ category: c.val })}`}
                    className={`text-sm ${
                      sp.category === c.val
                        ? 'font-semibold text-brand-blue'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FilterGroup>

          {/* Price quick filters */}
          <FilterGroup title="Price (ETB)">
            <ul className="space-y-2">
              {[
                { label: 'Any price', min: undefined, max: undefined },
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
                    <Link
                      href={`/search?${buildQs({
                        minPrice: p.min,
                        maxPrice: p.max,
                      })}`}
                      className={`text-sm ${
                        active ? 'font-semibold text-brand-blue' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {p.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </FilterGroup>
        </aside>

        {/* Results */}
        <section>
          {/* Sort bar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
            <span className="text-sm text-muted">
              Showing <strong className="text-ink">{listings.length}</strong> of {total}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">Sort by</span>
              <div className="flex flex-wrap gap-1">
                {SORTS.map((s) => {
                  const active = (sp.sort || 'popular') === s.val;
                  return (
                    <Link
                      key={s.val}
                      href={`/search?${buildQs({ sort: s.val })}`}
                      className={`rounded-pill px-3 py-1 text-xs font-medium ${
                        active
                          ? 'bg-brand-blue text-white'
                          : 'border border-line text-muted hover:text-ink'
                      }`}
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="rounded-card border border-line bg-surface p-10 text-center text-muted">
              No experiences found. Try removing some filters.
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

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 border-b border-line pb-5">
      <p className="mb-3 text-sm font-bold text-ink">{title}</p>
      {children}
    </div>
  );
}