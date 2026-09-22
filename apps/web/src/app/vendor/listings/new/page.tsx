'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ListingForm } from '@/components/vendor/ListingForm';

export default function CreateListingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
    if (!authLoading && user && user.role !== 'vendor' && user.role !== 'admin') {
      router.replace('/become-a-vendor');
    }
  }, [user, authLoading, router]);

  if (authLoading) return <div className="p-20 text-center text-muted">Loading…</div>;
  if (!user) return null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-ink">Create a listing</h1>
        <Link
          href="/vendor/listings"
          className="text-sm font-medium text-brand-blue hover:underline"
        >
          ← Back to listings
        </Link>
      </div>

      <ListingForm mode="create" />
    </main>
  );
}