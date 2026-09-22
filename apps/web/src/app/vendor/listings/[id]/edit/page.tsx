'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ListingForm, ListingFormValues } from '@/components/vendor/ListingForm';

export default function EditListingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [listing, setListing] = useState<ListingFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
    if (!authLoading && user && user.role !== 'vendor' && user.role !== 'admin') {
      router.replace('/become-a-vendor');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !id) return;
    (async () => {
      try {
        // Fetch all my listings, find the one matching id
        const { items } = await api.get('/listings/mine/all');
        const found = items.find((l: any) => l._id === id);
        if (!found) {
          setErr('Listing not found');
        } else {
          setListing(found);
        }
      } catch (e: any) {
        setErr(e.message || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    })();
  }, [user, id]);

  if (authLoading || loading) {
    return <div className="p-20 text-center text-muted">Loading…</div>;
  }
  if (!user) return null;

  if (err || !listing) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-card border border-line bg-surface p-10 text-center">
          <p className="text-danger">{err || 'Listing not found'}</p>
          <Link
            href="/vendor/listings"
            className="mt-4 inline-block rounded-pill bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blueHover"
          >
            Back to listings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Edit listing</h1>
          <p className="mt-1 text-sm text-muted">{listing.title}</p>
        </div>
        <Link
          href="/vendor/listings"
          className="text-sm font-medium text-brand-blue hover:underline"
        >
          ← Back to listings
        </Link>
      </div>

      <ListingForm mode="edit" initial={listing} />
    </main>
  );
}