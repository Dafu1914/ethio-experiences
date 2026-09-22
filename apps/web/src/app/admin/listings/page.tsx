'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Listing = {
  _id: string;
  slug: string;
  title: string;
  city: string;
  category: string;
  status: string;
  priceFrom: { amount: number; currency: string };
  images: { url: string; alt: string }[];
  vendorId: { _id: string; name: string; email: string };
  createdAt: string;
};

function AdminListingsInner() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [status, setStatus] = useState(initialStatus);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
    if (!authLoading && user && user.role !== 'admin') router.replace('/');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    (async () => {
      try {
        const qs = status === 'all' ? '' : `?status=${status}`;
        const { items } = await api.get(`/admin/listings${qs}`);
        setListings(items);
      } catch {}
      setLoading(false);
    })();
  }, [user, status]);

  const updateStatus = async (id: string, newStatus: string) => {
    setBusy(id);
    try {
      await api.patch(`/admin/listings/${id}/status`, { status: newStatus });
      setListings((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l))
      );
    } catch (e: any) {
      alert(e.message || 'Update failed');
    } finally {
      setBusy(null);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this listing permanently?')) return;
    setBusy(id);
    try {
      await api.delete(`/admin/listings/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    } finally {
      setBusy(null);
    }
  };

  if (authLoading || loading) {
    return <div className="p-20 text-center text-muted">Loading…</div>;
  }
  if (!user) return null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-ink">Listings</h1>
        <Link href="/admin" className="text-sm font-medium text-brand-blue hover:underline">
          ← Admin dashboard
        </Link>
      </div>

      {/* Filter pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'pending', 'published', 'archived', 'draft'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-pill px-4 py-1.5 text-xs font-semibold capitalize ${
              status === s
                ? 'bg-brand-blue text-white'
                : 'border border-line text-muted hover:text-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {listings.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-10 text-center">
          <p className="text-muted">No listings match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((l) => (
            <div
              key={l._id}
              className="flex flex-col gap-4 rounded-card border border-line bg-white p-4 sm:flex-row"
            >
              {/* Image */}
              <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-tile bg-surface sm:w-40">
                {l.images?.[0]?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={l.images[0].url}
                    alt={l.images[0].alt}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/listing/${l.slug}`}
                        target="_blank"
                        className="text-base font-bold text-ink hover:text-brand-blue"
                      >
                        {l.title}
                      </Link>
                      <p className="text-xs text-muted">
                        📍 {l.city} · {l.category} · by {l.vendorId?.name || 'Unknown'}
                      </p>
                    </div>
                    <StatusBadge status={l.status} />
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[13px] text-muted sm:grid-cols-3">
                    <span>
                      <strong className="text-ink">Price:</strong> {l.priceFrom.currency}{' '}
                      {l.priceFrom.amount.toLocaleString()}
                    </span>
                    <span>
                      <strong className="text-ink">Vendor:</strong>{' '}
                      {l.vendorId?.email || '—'}
                    </span>
                    <span>
                      <strong className="text-ink">Created:</strong>{' '}
                      {new Date(l.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {l.status !== 'published' && (
                    <button
                      disabled={busy === l._id}
                      onClick={() => updateStatus(l._id, 'published')}
                      className="rounded-pill bg-[#12A150] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0E8C42] disabled:opacity-50"
                    >
                      Approve &amp; publish
                    </button>
                  )}
                  {l.status === 'published' && (
                    <button
                      disabled={busy === l._id}
                      onClick={() => updateStatus(l._id, 'archived')}
                      className="rounded-pill border border-line px-4 py-1.5 text-xs font-semibold text-ink hover:bg-surface disabled:opacity-50"
                    >
                      Archive
                    </button>
                  )}
                  {l.status === 'pending' && (
                    <button
                      disabled={busy === l._id}
                      onClick={() => updateStatus(l._id, 'archived')}
                      className="rounded-pill border border-line px-4 py-1.5 text-xs font-semibold text-danger hover:bg-surface disabled:opacity-50"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    disabled={busy === l._id}
                    onClick={() => onDelete(l._id)}
                    className="rounded-pill border border-line px-4 py-1.5 text-xs font-semibold text-danger hover:bg-surface disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function AdminListingsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-muted">Loading…</div>}>
      <AdminListingsInner />
    </Suspense>
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
      className={`shrink-0 rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${cls}`}
    >
      {status}
    </span>
  );
}