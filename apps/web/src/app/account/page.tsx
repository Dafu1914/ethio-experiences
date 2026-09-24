'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/i18n/useT';

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const t = useT();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) return <div className="p-20 text-muted">{t('common.loading')}</div>;
  if (!user) return null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-ink">{t('account.title')}</h1>
        <Link
          href="/account/settings"
          className="text-sm font-medium text-brand-blue hover:underline"
        >
          {t('nav.settings')} →
        </Link>
      </div>

      <div className="space-y-3 rounded-card border border-line p-6">
        <Row label={t('account.name')} value={user.name} />
        <Row label={t('account.email')} value={user.email} />
        <Row label={t('account.role')} value={user.role} />
        <Row label={t('account.language')} value={(user.language || 'en').toUpperCase()} />
        <Row label={t('account.currency')} value={user.currency || 'ETB'} />
        <Row
          label={t('account.verified')}
          value={user.emailVerified ? t('account.yes') : t('account.no')}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/account/bookings"
          className="rounded-pill border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface"
        >
          {t('nav.bookings')}
        </Link>
        <Link
          href="/account/reviews"
          className="rounded-pill border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface"
        >
          {t('nav.reviews')}
        </Link>
      </div>

      <button
        onClick={async () => {
          await logout();
          router.push('/');
        }}
        className="mt-8 rounded-pill border border-line px-6 py-3 font-semibold text-ink hover:bg-surface"
      >
        {t('nav.logout')}
      </button>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line pb-2 last:border-0">
      <span className="text-muted capitalize">{label}</span>
      <span className="font-medium capitalize text-ink">{value}</span>
    </div>
  );
}