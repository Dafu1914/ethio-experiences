import { notFound } from 'next/navigation';
import { fetchListing } from '@/lib/server-api';
import { ListingDetail } from '@/components/listing/ListingDetail';

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

  return <ListingDetail listing={listing} />;
}