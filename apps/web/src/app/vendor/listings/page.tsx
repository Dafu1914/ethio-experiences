'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { TableSkeleton } from '@/components/ui/Skeleton';

type Listing = {
  _id: string;
  slug: string;
  title: string;
  city: string;
  category: string;
  type?: 'tour' | 'stay';
  status: string;
  priceFrom: { amount: number; currency: string };
  priceUnit?: 'person' | 'night';
  images: { url: string; alt: string }[];
};

type Tab = 'all' | 'tour' | 'stay';

export default function VendorListingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('all');

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
    if (!authLoading && user && user.role !== 'vendor' && user.role !== 'admin') {
      router.replace('/become-a-vendor');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) return;
    (async () => {
      try {
        const { items } = await api.get('/listings/mine/all');
        setListings(items);
      } catch {}
      setLoading(false);
    })();
  }, [user]);

  const filtered = useMemo(() => {
    if (tab === 'all') return listings;
    return listings.filter((l) => (l.type || 'tour') === tab);
  }, [listings, tab]);

  const counts = useMemo(
    () => ({
      all: listings.length,
      tour: listings.filter((l) => (l.type || 'tour') === 'tour').length,
      stay: listings.filter((l) => l.type === 'stay').length,
    }),
    [listings]
  );

  const onDelete = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await api.delete(`/listings/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
      toast.success('Listing deleted');
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    }
  };

  if (authLoading || loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-surface" />
        <TableSkeleton rows={5} />
      </main>
    );
  }
  if (!user) return null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Your listings</h1>
          <p className="mt-1 text-muted">{listings.length} total</p>
        </div>
        <Link
          href="/vendor/listings/new"
          className="rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
        >
          + New listing
        </Link>
      </div>

      {/* Type tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(
          [
            { key: 'all', label: 'All' },
            { key: 'tour', label: 'Tours' },
            { key: 'stay', label: 'Stays' },
          ] as const
        ).map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`rounded-pill px-4 py-1.5 text-sm font-semibold ${
              tab === tb.key
                ? 'bg-brand-blue text-white'
                : 'border border-line text-muted hover:text-ink'
            }`}
          >
            {tb.label}{' '}
            <span
              className={`ml-1 text-xs ${
                tab === tb.key ? 'text-white/80' : 'text-muted'
              }`}
            >
              ({counts[tb.key]})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-10 text-center">
          <div className="mb-3 text-5xl">🏔️</div>
          <p className="font-semibold text-ink">
            {tab === 'all'
              ? 'No listings yet'
              : tab === 'stay'
              ? 'No stays yet'
              : 'No tours yet'}
          </p>
          <p className="mt-1 text-sm text-muted">
            Create your first experience to start receiving bookings.
          </p>
          <Link
            href="/vendor/listings/new"
            className="mt-5 inline-block rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            Create listing
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {filtered.map((l) => (
                <tr key={l._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 shrink-0 overflow-hidden rounded bg-surface">
                        {l.images?.[0]?.url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={l.images[0].url}
                            alt={l.images[0].alt}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/listing/${l.slug}`}
                          className="block truncate font-medium text-ink hover:text-brand-blue"
                        >
                          {l.title}
                        </Link>
                        <span className="text-xs capitalize text-muted">
                          {l.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        l.type === 'stay'
                          ? 'bg-[#E7F0FF] text-[#0A66FF]'
                          : 'bg-[#FFF7E6] text-[#B26A00]'
                      }`}
                    >
                      {l.type === 'stay' ? 'Stay' : 'Tour'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{l.city}</td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {l.priceFrom.currency} {l.priceFrom.amount.toLocaleString()}
                    <span className="ml-1 text-[10px] font-normal uppercase text-muted">
                      {l.priceUnit === 'night' ? '/ night' : '/ person'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/vendor/listings/${l._id}/edit`}
                      className="mr-2 text-xs font-semibold text-brand-blue hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(l._id)}
                      className="text-xs font-semibold text-danger hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'published'
      ? 'bg-[#E7F6EE] text-[#12A150]'
      : status === 'pending'
      ? 'bg-[#FFF7E6] text-[#B26A00]'
      : status === 'draft'
      ? 'bg-surface text-muted'
      : 'bg-danger/10 text-danger';
  return (
    <span
      className={`rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${cls}`}
    >
      {status}
    </span>
  );
}