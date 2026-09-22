'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, imageUrl } from '@/lib/api';
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
};

export default function VendorListingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

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

  const onDelete = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await api.delete(`/listings/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  };

  if (authLoading || loading) {
    return <div className="p-20 text-center text-muted">Loading…</div>;
  }
  if (!user) return null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
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

      {listings.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-10 text-center">
          <p className="text-muted">You don&apos;t have any listings yet.</p>
          <Link
            href="/vendor/listings/new"
            className="mt-4 inline-block rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {listings.map((l) => (
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
                        <span className="text-xs capitalize text-muted">{l.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{l.city}</td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {l.priceFrom.currency} {l.priceFrom.amount.toLocaleString()}
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