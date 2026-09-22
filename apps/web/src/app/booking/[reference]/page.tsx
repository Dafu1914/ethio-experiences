import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function fetchBooking(ref: string) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  const res = await fetch(`${API}/bookings/public/${ref}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.booking;
}

export default async function BookingConfirmedPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const booking = await fetchBooking(reference);
  if (!booking) notFound();

  const listing = booking.listingId;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="rounded-card border border-line bg-white p-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E7F6EE]">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-[#12A150]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-ink">Booking confirmed!</h1>
            <p className="text-sm text-muted">
              A confirmation email has been sent to {booking.contactEmail}
            </p>
          </div>
        </div>

        {/* Reference */}
        <div className="rounded-tile bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Reference
          </p>
          <p className="mt-1 font-mono text-xl font-bold tracking-wide text-ink">
            {booking.reference}
          </p>
        </div>

        {/* Listing — safe against deleted listings */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Your experience
          </p>
          {listing ? (
            <>
              <Link
                href={`/listing/${listing.slug}`}
                className="mt-1 block text-lg font-bold text-ink hover:text-brand-blue"
              >
                {listing.title}
              </Link>
              <p className="text-sm text-muted">📍 {listing.city}</p>
            </>
          ) : (
            <p className="mt-1 text-sm italic text-muted">
              This listing is no longer available.
            </p>
          )}
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <Row label="Date" value={new Date(booking.date).toDateString()} />
          <Row label="Time" value={booking.timeSlot || '—'} />
          <Row
            label="Participants"
            value={`${booking.participants.adults} adult${
              booking.participants.adults > 1 ? 's' : ''
            }${
              booking.participants.children
                ? `, ${booking.participants.children} child${
                    booking.participants.children > 1 ? 'ren' : ''
                  }`
                : ''
            }`}
          />
          <Row label="Status" value={booking.status} />
          <Row label="Name" value={booking.contactName} />
          <Row label="Email" value={booking.contactEmail} />
        </div>

        {/* Total */}
        <div className="mt-6 rounded-tile border border-line bg-surface p-4">
          <div className="flex justify-between text-base font-bold text-ink">
            <span>Total</span>
            <span>
              {booking.total.currency} {booking.total.amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/account/bookings"
            className="rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            View my bookings
          </Link>
          <Link
            href="/"
            className="rounded-pill border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-0.5 font-medium capitalize text-ink">{value}</p>
    </div>
  );
}