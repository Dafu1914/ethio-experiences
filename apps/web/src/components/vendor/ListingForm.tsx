'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { api, uploadFiles } from '@/lib/api';

const CITIES = [
  'Addis Ababa',
  'Lalibela',
  'Gondar',
  'Axum',
  'Harar',
  'Bahir Dar',
  'Mekelle',
  'Jinka',
  'Hawzien',
  'Other',
];

const CATEGORIES = [
  { val: 'tour', label: 'Tour' },
  { val: 'trek', label: 'Trek' },
  { val: 'culture', label: 'Culture' },
  { val: 'festival', label: 'Festival' },
  { val: 'wildlife', label: 'Wildlife' },
  { val: 'stay', label: 'Stay' },
  { val: 'transport', label: 'Transport' },
];

const PROPERTY_TYPES = [
  { val: 'hotel', label: 'Hotel' },
  { val: 'lodge', label: 'Lodge' },
  { val: 'guesthouse', label: 'Guesthouse' },
  { val: 'homestay', label: 'Homestay' },
  { val: 'camp', label: 'Camp' },
];

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(
    /\/api\/?$/,
    ''
  );

const toAbsolute = (url: string) =>
  url.startsWith('/uploads/') ? `${API_BASE}${url}` : url;

export type ListingFormValues = {
  _id?: string;
  type?: 'tour' | 'stay';
  title?: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  city?: string;
  region?: string;
  durationMinutes?: number;
  groupSize?: number;
  languages?: string[];
  priceFrom?: { amount: number; currency: 'ETB' | 'USD' | 'EUR' };
  priceUnit?: 'person' | 'night' | 'day' | 'trip';
  highlights?: string[];
  included?: string[];
  notIncluded?: string[];
  meetingPoint?: { name?: string; address?: string };
  cancellationPolicy?: '24h-free' | '48h-free' | 'non-refundable';
  images?: { url: string; alt: string }[];
  stay?: {
    propertyType?: 'hotel' | 'lodge' | 'guesthouse' | 'homestay' | 'camp';
    roomTypes?: { name: string; pricePerNight: number; capacity: number }[];
    amenities?: string[];
    checkInTime?: string;
    checkOutTime?: string;
    maxGuests?: number;
    bedrooms?: number;
    bathrooms?: number;
  };
};

export function ListingForm({
  mode,
  initial,
}: {
  mode: 'create' | 'edit';
  initial?: ListingFormValues;
}) {
  const router = useRouter();

  // ── Base fields
  const [type, setType] = useState<'tour' | 'stay'>(initial?.type || 'tour');
  const [title, setTitle] = useState(initial?.title || '');
  const [shortDescription, setShortDescription] = useState(
    initial?.shortDescription || ''
  );
  const [description, setDescription] = useState(initial?.description || '');
  const [category, setCategory] = useState(
    initial?.category || (initial?.type === 'stay' ? 'stay' : 'tour')
  );
  const [city, setCity] = useState(initial?.city || 'Addis Ababa');
  const [region, setRegion] = useState(initial?.region || '');
  const [languages, setLanguages] = useState(
    (initial?.languages || ['en']).join(', ')
  );
  const [priceAmount, setPriceAmount] = useState(
    initial?.priceFrom?.amount ?? 2000
  );
  const [currency, setCurrency] = useState<'ETB' | 'USD' | 'EUR'>(
    initial?.priceFrom?.currency || 'ETB'
  );
  const [highlights, setHighlights] = useState(
    (initial?.highlights || []).join('\n')
  );
  const [included, setIncluded] = useState((initial?.included || []).join('\n'));
  const [notIncluded, setNotIncluded] = useState(
    (initial?.notIncluded || []).join('\n')
  );
  const [cancellationPolicy, setCancellationPolicy] = useState<
    '24h-free' | '48h-free' | 'non-refundable'
  >(initial?.cancellationPolicy || '24h-free');

  // ── Tour-only fields
  const [durationMinutes, setDurationMinutes] = useState(
    initial?.durationMinutes ?? 240
  );
  const [groupSize, setGroupSize] = useState(initial?.groupSize ?? 12);
  const [meetingName, setMeetingName] = useState(
    initial?.meetingPoint?.name || ''
  );
  const [meetingAddress, setMeetingAddress] = useState(
    initial?.meetingPoint?.address || ''
  );

  // ── Stay-only fields
  const [propertyType, setPropertyType] = useState<
    'hotel' | 'lodge' | 'guesthouse' | 'homestay' | 'camp'
  >(initial?.stay?.propertyType || 'lodge');
  const [amenities, setAmenities] = useState(
    (initial?.stay?.amenities || []).join(', ')
  );
  const [checkInTime, setCheckInTime] = useState(
    initial?.stay?.checkInTime || '14:00'
  );
  const [checkOutTime, setCheckOutTime] = useState(
    initial?.stay?.checkOutTime || '11:00'
  );
  const [maxGuests, setMaxGuests] = useState(initial?.stay?.maxGuests ?? 2);
  const [bedrooms, setBedrooms] = useState(initial?.stay?.bedrooms ?? 1);
  const [bathrooms, setBathrooms] = useState(initial?.stay?.bathrooms ?? 1);
  const [roomTypes, setRoomTypes] = useState<
    { name: string; pricePerNight: number; capacity: number }[]
  >(
    initial?.stay?.roomTypes || [
      { name: 'Standard Room', pricePerNight: 3000, capacity: 2 },
    ]
  );

  // ── Shared
  const [images, setImages] = useState<string[]>(
    (initial?.images || []).map((i) => toAbsolute(i.url))
  );
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setErr('');
    try {
      const urls = await uploadFiles(Array.from(files));
      setImages((prev) => [...prev, ...urls.map(toAbsolute)]);
      toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
    } catch (e: any) {
      setErr(e.message || 'Upload failed');
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url));
  };

  // ── Room type helpers
  const addRoomType = () => {
    setRoomTypes((prev) => [
      ...prev,
      { name: '', pricePerNight: 3000, capacity: 2 },
    ]);
  };

  const updateRoomType = (
    i: number,
    field: 'name' | 'pricePerNight' | 'capacity',
    value: any
  ) => {
    setRoomTypes((prev) =>
      prev.map((r, idx) =>
        idx === i
          ? { ...r, [field]: field === 'name' ? value : Number(value) }
          : r
      )
    );
  };

  const removeRoomType = (i: number) => {
    setRoomTypes((prev) => prev.filter((_, idx) => idx !== i));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setBusy(true);

    if (images.length === 0) {
      setErr('Please upload at least one image.');
      setBusy(false);
      return;
    }

    try {
      const payload: any = {
        type,
        title,
        shortDescription,
        description,
        category,
        city,
        region: region || city,
        images: images.map((url, i) => ({ url, alt: `${title} — photo ${i + 1}` })),
        languages: languages
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        priceFrom: { amount: Number(priceAmount), currency },
        priceUnit: type === 'stay' ? 'night' : 'person',
        highlights: highlights
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        included: included
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        notIncluded: notIncluded
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        cancellationPolicy,
      };

      if (type === 'tour') {
        payload.durationMinutes = Number(durationMinutes);
        payload.groupSize = Number(groupSize);
        payload.meetingPoint =
          meetingName && meetingAddress
            ? { name: meetingName, address: meetingAddress }
            : undefined;
      } else {
        payload.durationMinutes = 1440;
        payload.groupSize = Number(maxGuests);
        payload.stay = {
          propertyType,
          roomTypes: roomTypes
            .filter((r) => r.name.trim())
            .map((r) => ({
              name: r.name.trim(),
              pricePerNight: Number(r.pricePerNight),
              capacity: Number(r.capacity),
            })),
          amenities: amenities
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          checkInTime,
          checkOutTime,
          maxGuests: Number(maxGuests),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
        };
      }

      if (mode === 'create') {
        await api.post('/listings', payload);
        toast.success('Listing created');
      } else if (initial?._id) {
        await api.patch(`/listings/${initial._id}`, payload);
        toast.success('Listing saved');
      }

      router.push('/vendor/listings');
    } catch (e: any) {
      setErr(e.message || 'Failed to save listing');
      toast.error(e.message || 'Failed to save');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {err && (
        <div className="rounded-tile border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
          {err}
        </div>
      )}

      {/* TYPE SELECTOR */}
      <div className="rounded-card border border-line bg-white p-5">
        <h2 className="mb-4 text-lg font-extrabold text-ink">What are you listing?</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setType('tour');
              if (category !== 'tour') setCategory('tour');
            }}
            className={`rounded-card border-2 p-4 text-left transition ${
              type === 'tour'
                ? 'border-brand-blue bg-brand-blue/5'
                : 'border-line hover:border-muted'
            }`}
          >
            <div className="text-2xl">🏛️</div>
            <p className="mt-2 font-bold text-ink">Tour / Experience</p>
            <p className="text-xs text-muted">
              Guided activities with a fixed duration
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setType('stay');
              if (category !== 'stay') setCategory('stay');
            }}
            className={`rounded-card border-2 p-4 text-left transition ${
              type === 'stay'
                ? 'border-brand-blue bg-brand-blue/5'
                : 'border-line hover:border-muted'
            }`}
          >
            <div className="text-2xl">🏨</div>
            <p className="mt-2 font-bold text-ink">Stay</p>
            <p className="text-xs text-muted">
              Hotel, lodge, guesthouse, or homestay
            </p>
          </button>
        </div>
      </div>

      {/* BASICS */}
      <Section title="Basic information">
        <Field label="Title">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              type === 'stay'
                ? 'e.g. Simien Lodge — Highest Lodge in Africa'
                : 'e.g. Lalibela: Rock-Hewn Churches Full-Day Tour'
            }
            className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
        </Field>

        <Field label="Short description (max 200 chars)">
          <input
            type="text"
            required
            maxLength={200}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="One-line summary"
            className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
        </Field>

        <Field label="Full description">
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            >
              {CATEGORIES.map((c) => (
                <option key={c.val} value={c.val}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="City">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Region (optional — defaults to city)">
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g. Amhara"
            className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
        </Field>
      </Section>

      {/* TYPE-SPECIFIC */}
      {type === 'tour' ? (
        <Section title="Tour logistics">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Duration (minutes)">
              <input
                type="number"
                min={30}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </Field>
            <Field label="Group size">
              <input
                type="number"
                min={1}
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Meeting point name">
              <input
                type="text"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                placeholder="e.g. Lalibela Main Gate"
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </Field>
            <Field label="Meeting point address">
              <input
                type="text"
                value={meetingAddress}
                onChange={(e) => setMeetingAddress(e.target.value)}
                placeholder="e.g. Lalibela, Amhara"
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </Field>
          </div>
        </Section>
      ) : (
        <Section title="Stay details">
          <Field label="Property type">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as any)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            >
              {PROPERTY_TYPES.map((p) => (
                <option key={p.val} value={p.val}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Max guests">
              <input
                type="number"
                min={1}
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </Field>
            <Field label="Bedrooms">
              <input
                type="number"
                min={0}
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </Field>
            <Field label="Bathrooms">
              <input
                type="number"
                min={0}
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Check-in time">
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </Field>
            <Field label="Check-out time">
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </Field>
          </div>

          <Field label="Amenities (comma-separated, e.g. WiFi, Restaurant, Parking)">
            <input
              type="text"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder="WiFi, Restaurant, Pool, Parking"
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </Field>
        </Section>
      )}

      {/* ROOM TYPES (only for stays) */}
      {type === 'stay' && (
        <Section title="Room types">
          <div className="space-y-3">
            {roomTypes.map((room, i) => (
              <div
                key={i}
                className="grid grid-cols-1 gap-2 rounded-tile border border-line bg-surface p-3 sm:grid-cols-[1fr_140px_100px_40px]"
              >
                <input
                  type="text"
                  placeholder="Room name"
                  value={room.name}
                  onChange={(e) => updateRoomType(i, 'name', e.target.value)}
                  className="rounded-tile border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
                />
                <input
                  type="number"
                  placeholder="Price/night"
                  min={0}
                  value={room.pricePerNight}
                  onChange={(e) =>
                    updateRoomType(i, 'pricePerNight', e.target.value)
                  }
                  className="rounded-tile border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
                />
                <input
                  type="number"
                  placeholder="Sleeps"
                  min={1}
                  value={room.capacity}
                  onChange={(e) => updateRoomType(i, 'capacity', e.target.value)}
                  className="rounded-tile border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
                />
                <button
                  type="button"
                  onClick={() => removeRoomType(i)}
                  disabled={roomTypes.length === 1}
                  className="rounded-tile border border-line text-danger hover:bg-danger/10 disabled:opacity-30"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addRoomType}
            className="mt-2 rounded-pill border border-line px-4 py-1.5 text-xs font-semibold text-ink hover:bg-surface"
          >
            + Add room type
          </button>
        </Section>
      )}

      {/* PRICING */}
      <Section title="Pricing">
        <div className="grid grid-cols-2 gap-3">
          <Field label={type === 'stay' ? 'Base price per night' : 'Price per person'}>
            <input
              type="number"
              min={0}
              value={priceAmount}
              onChange={(e) => setPriceAmount(Number(e.target.value))}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </Field>
          <Field label="Currency">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
            >
              <option value="ETB">ETB</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </Field>
        </div>

        <Field label="Cancellation policy">
          <select
            value={cancellationPolicy}
            onChange={(e) => setCancellationPolicy(e.target.value as any)}
            className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
          >
            <option value="24h-free">Free cancellation up to 24h before</option>
            <option value="48h-free">Free cancellation up to 48h before</option>
            <option value="non-refundable">Non-refundable</option>
          </select>
        </Field>
      </Section>

      {/* HIGHLIGHTS & INCLUDES */}
      <Section title="What travelers can expect">
        <Field label="Highlights (one per line)">
          <textarea
            rows={3}
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            placeholder={
              type === 'stay'
                ? 'Highest lodge in Africa\nPanoramic mountain views'
                : 'Visit all 11 churches\nCertified local guide'
            }
            className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
        </Field>

        <Field label="What's included (one per line)">
          <textarea
            rows={3}
            value={included}
            onChange={(e) => setIncluded(e.target.value)}
            placeholder={
              type === 'stay'
                ? 'Breakfast\nWiFi\nMountain views'
                : 'Guide\nEntrance fees\nBottled water'
            }
            className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
        </Field>

        <Field label="Not included (one per line)">
          <textarea
            rows={3}
            value={notIncluded}
            onChange={(e) => setNotIncluded(e.target.value)}
            placeholder={'Lunch\nTips'}
            className="w-full rounded-tile border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
        </Field>
      </Section>

      {/* IMAGES */}
      <Section title="Images">
        <Field label="Upload at least 1 image (JPG, PNG, WEBP — max 8MB each)">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onUpload}
            disabled={uploading}
            className="w-full text-sm"
          />
        </Field>

        {uploading && <p className="text-sm text-muted">Uploading…</p>}

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((url) => (
              <div
                key={url}
                className="group relative overflow-hidden rounded-tile border border-line"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="aspect-[16/10] w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-danger shadow"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* SUBMIT */}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-pill bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blueHover disabled:opacity-50"
        >
          {busy
            ? mode === 'create'
              ? 'Creating…'
              : 'Saving…'
            : mode === 'create'
            ? 'Create listing'
            : 'Save changes'}
        </button>
        <Link
          href="/vendor/listings"
          className="rounded-pill border border-line px-6 py-3 text-sm font-semibold text-ink hover:bg-surface"
        >
          Cancel
        </Link>
      </div>
      {mode === 'create' && (
        <p className="text-xs text-muted">
          New listings are reviewed by our team and published within 24 hours.
        </p>
      )}
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-white p-5">
      <h2 className="mb-4 text-lg font-extrabold text-ink">{title}</h2>
      <div className="space-y-4">{children}</div>
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