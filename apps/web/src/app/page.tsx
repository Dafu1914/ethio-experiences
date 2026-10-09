import { fetchListings } from '@/lib/server-api';
import { ListingCardData } from '@/components/ui/ListingCard';
import { Hero } from '@/components/home/Hero';
import { HomeListings } from '@/components/home/HomeListings';
import { HomeJsonLd } from '@/components/home/HomeJsonLd';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let listings: ListingCardData[] = [];
  let total = 0;

  try {
    // Fetch 12 of each type, then merge
    const [toursRes, staysRes] = await Promise.all([
      fetchListings({ limit: '8', sort: 'popular', type: 'tour' }),
      fetchListings({ limit: '8', sort: 'popular', type: 'stay' }),
    ]);

    listings = [...(toursRes.items || []), ...(staysRes.items || [])];
    total = (toursRes.total || 0) + (staysRes.total || 0);
  } catch {}

  return (
    <main>
      <HomeJsonLd />
      <Hero />
      <HomeListings listings={listings} total={total} />
    </main>
  );
}