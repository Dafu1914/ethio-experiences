'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export type BookingModalListing = {
  _id: string;
  title: string;
  priceFrom: { amount: number; currency: string };
};

export function BookingModal({
  listing,
  open,
  onClose,
}: {
  listing: BookingModalListing;
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:00');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  if (!open) return null;

  const total = listing.priceFrom.amount * adults;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    if (!user) {
      router.push('/login?next=/');
      return;
    }

    setLoading(true);
    try {
      const { booking } = await api.post('/bookings', {
        listingId: listing._id,
        date,
        timeSlot,
        participants: { adults, children },
        contactName: name,
        contactEmail: email,
        contactPhone: phone,
        notes,
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
            <h2 className="text-xl font-extrabold text-ink">Book this experience</h2>
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
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input
                type="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-blue"
              />
            </Field>

            <Field label="Time">
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-blue"
              >
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="13:00">13:00</option>
                <option value="15:00">15:00</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Adults">
              <input
                type="number"
                min={1}
                value={adults}
                onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-blue"
              />
            </Field>
            <Field label="Children">
              <input
                type="number"
                min={0}
                value={children}
                onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-blue"
              />
            </Field>
          </div>

          <Field label="Full name">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-blue"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-blue"
            />
          </Field>

          <Field label="Phone (optional)">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+251 9xx xxx xxx"
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-blue"
            />
          </Field>

          <Field label="Notes (optional)">
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-blue"
            />
          </Field>

          <div className="rounded-tile border border-line bg-surface p-3">
            <div className="flex justify-between text-sm text-muted">
              <span>
                {listing.priceFrom.currency} {listing.priceFrom.amount.toLocaleString()} ×{' '}
                {adults} adult{adults > 1 ? 's' : ''}
              </span>
              <span>
                {listing.priceFrom.currency} {total.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-bold text-ink">
              <span>Total</span>
              <span>
                {listing.priceFrom.currency} {total.toLocaleString()}
              </span>
            </div>
          </div>

          {err && <p className="text-sm text-danger">{err}</p>}

          <button
            type="submit"
            disabled={loading}
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