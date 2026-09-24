'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="text-7xl">⚠️</div>
      <h1 className="mt-6 text-4xl font-extrabold text-ink">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">
        We hit an unexpected error. Try again, or go back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-pill bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blueHover"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-pill border border-line px-6 py-3 text-sm font-semibold text-ink hover:bg-surface"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}