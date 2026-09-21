import { fetchListings } from '@/lib/server-api';
import { ListingCard, ListingCardData } from '@/components/ui/ListingCard';

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
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="mb-12">
        <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">
          Discover Ethiopia
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Book unforgettable tours, treks, and cultural experiences — from the rock churches of
          Lalibela to the peaks of the Simien Mountains.
        </p>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold text-ink">Popular experiences</h2>
          <span className="text-sm text-muted">{total} experiences</span>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-card border border-line bg-surface p-10 text-center text-muted">
            No experiences yet. Run <code>npm run seed</code> in <code>apps/api</code>.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l._id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}