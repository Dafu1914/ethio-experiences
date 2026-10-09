import { notFound } from 'next/navigation';
import { fetchListing } from '@/lib/server-api';
import { TourDetail } from '@/components/listing/TourDetail';
import { StayDetail } from '@/components/listing/StayDetail';
import { DriverDetail } from '@/components/listing/DriverDetail';

export const dynamic = 'force-dynamic';

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let listing: any = null;
  try {
    listing = await fetchListing(slug);
  } catch {
    notFound();
  }

  if (!listing) notFound();

  if (listing.type === 'stay') return <StayDetail listing={listing} />;
  if (listing.type === 'driver') return <DriverDetail listing={listing} />;
  return <TourDetail listing={listing} />;
}