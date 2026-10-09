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
    const [toursRes, staysRes, driversRes, guidesRes] = await Promise.all([
      fetchListings({ limit: '6', sort: 'popular', type: 'tour' }),
      fetchListings({ limit: '6', sort: 'popular', type: 'stay' }),
      fetchListings({ limit: '6', sort: 'popular', type: 'driver' }),
      fetchListings({ limit: '6', sort: 'popular', type: 'guide' }),
    ]);

    listings = [
      ...(toursRes.items || []),
      ...(staysRes.items || []),
      ...(driversRes.items || []),
      ...(guidesRes.items || []),
    ];
    total =
      (toursRes.total || 0) +
      (staysRes.total || 0) +
      (driversRes.total || 0) +
      (guidesRes.total || 0);
  } catch (err) {
    console.error('[home] fetch failed:', err);
  }

  return (
    <main>
      <HomeJsonLd />
      <Hero />
      <HomeListings listings={listings} total={total} />
    </main>
  );
}