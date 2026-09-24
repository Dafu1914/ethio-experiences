import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchListing } from '@/lib/server-api';
import { MediaMosaic } from '@/components/listing/MediaMosaic';
import { BookingCard } from '@/components/listing/BookingCard';
import { SectionHeading } from '@/components/listing/SectionHeading';
import { ReviewsSection } from '@/components/listing/ReviewsSection';

export const dynamic = 'force-dynamic';

function formatDuration(mins: number) {
  if (mins < 60) return `${mins} minutes`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h >= 24) {
    const d = Math.floor(h / 24);
    const rh = h % 24;
    return rh ? `${d} days ${rh}h` : `${d} days`;
  }
  return m ? `${h}h ${m}m` : `${h} hours`;
}

function policyLabel(p: string) {
  if (p === '24h-free') return 'Free cancellation up to 24 hours before';
  if (p === '48h-free') return 'Free cancellation up to 48 hours before';
  return 'Non-refundable';
}

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

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>›</span>
        <Link href="/" className="hover:text-ink">
          Explore {listing.city}
        </Link>
        <span>›</span>
        <span className="text-ink">{listing.category}</span>
      </nav>

      {/* Hero */}
      <div className="mb-6">
        {listing.isOriginal && (
          <span className="inline-block rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Original by Ethio Experiences
          </span>
        )}
        <h1 className="mt-3 text-[28px] font-extrabold leading-tight text-ink md:text-[34px]">
          {listing.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
          <span className="flex items-center gap-1">
            <span className="text-star">★</span>
            <span className="font-semibold text-ink">{listing.rating.avg.toFixed(1)}</span>
            <span className="text-muted">({listing.rating.count.toLocaleString()} reviews)</span>
          </span>
          <span className="text-muted">·</span>
          <span className="text-muted">
            Provider: <span className="font-medium text-ink">Ethio Demo Vendor</span>
          </span>
          <div className="ml-auto flex items-center gap-4 text-brand-blue">
            <button className="flex items-center gap-1 hover:underline">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Add to wishlist
            </button>
            <button className="flex items-center gap-1 hover:underline">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Media mosaic */}
      <MediaMosaic images={listing.images} />

      {/* Body */}
      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[1fr_380px]">
        <div>
          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-4 rounded-card border border-line p-5 text-sm md:grid-cols-4">
            <Fact label="Duration" value={formatDuration(listing.durationMinutes)} />
            <Fact label="Group size" value={`Up to ${listing.groupSize}`} />
            <Fact
              label="Languages"
              value={listing.languages.map((l: string) => l.toUpperCase()).join(', ')}
            />
            <Fact label="Category" value={listing.category} />
          </div>

          <SectionHeading>About this experience</SectionHeading>
          <p className="text-[15px] leading-relaxed text-body">{listing.description}</p>

          {listing.highlights?.length > 0 && (
            <>
              <SectionHeading>Highlights</SectionHeading>
              <ul className="space-y-2 text-[15px] text-body">
                {listing.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" />
                    {h}
                  </li>
                ))}
              </ul>
            </>
          )}

          {listing.included?.length > 0 && (
            <>
              <SectionHeading>What&apos;s included</SectionHeading>
              <ul className="space-y-2 text-[15px] text-body">
                {listing.included.map((h: string, i: number) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-success">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </>
          )}

          {listing.notIncluded?.length > 0 && (
            <>
              <SectionHeading>Not included</SectionHeading>
              <ul className="space-y-2 text-[15px] text-body">
                {listing.notIncluded.map((h: string, i: number) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-danger">✕</span>
                    {h}
                  </li>
                ))}
              </ul>
            </>
          )}

          {listing.meetingPoint && (
            <>
              <SectionHeading>Meeting point</SectionHeading>
              <p className="text-[15px] text-body">
                <strong className="text-ink">{listing.meetingPoint.name}</strong>
                <br />
                {listing.meetingPoint.address}
              </p>
            </>
          )}

                 <SectionHeading>Cancellation policy</SectionHeading>
          <p className="text-[15px] text-body">{policyLabel(listing.cancellationPolicy)}</p>
        </div>

        <BookingCard listing={listing} />
      </div>

      {/* Reviews — full width, below both columns */}
      <ReviewsSection
        listingSlug={listing.slug}
        listingId={listing._id}
        averageRating={listing.rating?.avg || 0}
        reviewCount={listing.rating?.count || 0}
      />
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-medium capitalize text-ink">{value}</p>
    </div>
  );
}