import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="text-7xl">🧭</div>
      <h1 className="mt-6 text-4xl font-extrabold text-ink">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-pill bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blueHover"
        >
          Back to home
        </Link>
        <Link
          href="/search"
          className="rounded-pill border border-line px-6 py-3 text-sm font-semibold text-ink hover:bg-surface"
        >
          Browse experiences
        </Link>
      </div>
    </main>
  );
}