import { fetchListings } from '@/lib/server-api';
import { ListingCardData } from '@/components/ui/ListingCard';
import { Hero } from '@/components/home/Hero';
import { HomeListings } from '@/components/home/HomeListings';

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
      <Hero />
      <HomeListings listings={listings} total={total} />
    </main>
  );
}