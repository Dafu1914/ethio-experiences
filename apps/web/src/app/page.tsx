import Link from 'next/link';
import { fetchListings } from '@/lib/server-api';
import { ListingCard, ListingCardData } from '@/components/ui/ListingCard';
import { Hero } from '@/components/home/Hero';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let listings: ListingCardData[] = [];
  let total = 0;

  try {
    const data = await fetchListings({ limit: '12', sort: 'popular' });
    listings = data.items;
    total = data.total;
  } catch {}

  return (
    <main>
      {/* Hero */}
      <Hero />

      {/* Listings */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold text-ink">Popular experiences</h2>
          <span className="text-sm text-muted">{total} experiences</span>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-card border border-line bg-surface p-12 text-center">
            <div className="mb-3 text-5xl">🌍</div>
            <p className="font-semibold text-ink">No experiences yet</p>
            <p className="mt-1 text-sm text-muted">
              Run <code className="rounded bg-white px-1.5 py-0.5 text-xs">npm run seed</code> in
              the API to load sample data.
            </p>
            <Link
              href="/search"
              className="mt-5 inline-block rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
            >
              Browse all
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
              View all experiences
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}