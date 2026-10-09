'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice } from '@/i18n/strings';
import type { StayBookingListing } from './StayBookingCard';

type Room = { name: string; pricePerNight: number; capacity: number };

export function StayBookingModal({
  listing,
  open,
  onClose,
}: {
  listing: StayBookingListing;
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const { currency } = useLocale();

  const rooms: Room[] = listing.stay?.roomTypes || [];

  const [roomIndex, setRoomIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    // Default check-in to tomorrow, check-out to the day after
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    setCheckIn(tomorrow.toISOString().slice(0, 10));
    setCheckOut(dayAfter.toISOString().slice(0, 10));
  }, []);

  if (!open) return null;

  const selectedRoom = rooms[roomIndex];
  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const inD = new Date(checkIn);
    const outD = new Date(checkOut);
    const diff = Math.ceil((outD.getTime() - inD.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  })();

  const pricePerNight = selectedRoom?.pricePerNight || listing.priceFrom.amount;
  const total = pricePerNight * nights;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    if (!user) {
      router.push('/login?next=/');
      return;
    }
    if (nights <= 0) {
      setErr('Check-out must be after check-in');
      return;
    }

    setLoading(true);
    try {
      const { booking } = await api.post('/bookings', {
        listingId: listing._id,
        date: checkIn,
        timeSlot: checkOut, // repurposed: used as checkout date
        participants: { adults: guests, children: 0 },
        contactName: name,
        contactEmail: email,
        contactPhone: phone,
        notes: `Room: ${selectedRoom?.name || 'Standard'}${
          notes ? ` · ${notes}` : ''
        }`,
      });
      toast.success('Booking confirmed!');
      router.push(`/booking/${booking.reference}`);
    } catch (e: any) {
      setErr(e.message || 'Booking failed');
      toast.error(e.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-ink">Book this stay</h2>
            <p className="mt-1 line-clamp-1 text-sm text-muted">{listing.title}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted hover:bg-surface"
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {!user && (
          <div className="mb-4 rounded-tile bg-brand-blue/5 p-3 text-sm text-brand-blue">
            You&apos;ll be asked to log in before confirming.
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Room selection */}
          {rooms.length > 0 && (
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
                Room type
              </span>
              <select
                value={roomIndex}
                onChange={(e) => setRoomIndex(Number(e.target.value))}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
              >
                {rooms.map((r, i) => (
                  <option key={i} value={i}>
                    {r.name} · {formatPrice(r.pricePerNight, currency)} / night
                  </option>
                ))}
              </select>
            </label>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Check-in">
              <input
                type="date"
                required
                value={checkIn}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </Field>
            <Field label="Check-out">
              <input
                type="date"
                required
                value={checkOut}
                min={checkIn || new Date().toISOString().slice(0, 10)}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </Field>
          </div>

          {/* Guests */}
          <Field label="Guests">
            <input
              type="number"
              min={1}
              max={selectedRoom?.capacity || 4}
              value={guests}
              onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </Field>

          <Field label="Full name">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </Field>

          <Field label="Phone (optional)">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+251 9xx xxx xxx"
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </Field>

          <Field label="Notes (optional)">
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </Field>

          {/* Summary */}
          <div className="rounded-tile border border-line bg-surface p-3">
            <div className="flex justify-between text-sm text-muted">
              <span>
                {formatPrice(pricePerNight, currency)} × {nights} night
                {nights !== 1 ? 's' : ''}
              </span>
              <span>{formatPrice(total, currency)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-bold text-ink">
              <span>Total</span>
              <span>{formatPrice(total, currency)}</span>
            </div>
          </div>

          {err && <p className="text-sm text-danger">{err}</p>}

          <button
            type="submit"
            disabled={loading || nights <= 0}
            className="w-full rounded-pill bg-brand-blue py-3 font-semibold text-white transition hover:bg-brand-blueHover disabled:opacity-50"
          >
            {loading ? 'Booking…' : user ? 'Confirm booking' : 'Log in & book'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}