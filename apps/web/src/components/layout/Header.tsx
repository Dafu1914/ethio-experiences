'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { LocaleModal } from './LocaleModal';
import { useT } from '@/i18n/useT';

export function Header() {
  const { user, logout } = useAuth();
  const { language, currency } = useLocale();
  const pathname = usePathname();
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-brand-orange"
        >
          ETHIO EXPERIENCES
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink md:flex">
          <div className="relative group">
            <button className="flex items-center gap-1 py-5 hover:text-brand-blue">
              {t('nav.places')}
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="invisible absolute left-0 top-full w-56 rounded-card border border-line bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {['Addis Ababa', 'Lalibela', 'Gondar', 'Axum', 'Harar', 'Bahir Dar'].map((c) => (
                <Link
                  key={c}
                  href={`/search?city=${encodeURIComponent(c)}`}
                  className="block rounded px-3 py-2 text-sm text-ink hover:bg-surface"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1 py-5 hover:text-brand-blue">
              {t('nav.things')}
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="invisible absolute left-0 top-full w-56 rounded-card border border-line bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {[
                { label: 'Tours', val: 'tour' },
                { label: 'Treks', val: 'trek' },
                { label: 'Culture', val: 'culture' },
                { label: 'Festivals', val: 'festival' },
                { label: 'Wildlife', val: 'wildlife' },
                { label: 'Stays', val: 'stay' },
                { label: 'Transport', val: 'transport' },
              ].map((c) => (
                <Link
                  key={c.val}
                  href={`/search?category=${c.val}`}
                  className="block rounded px-3 py-2 text-sm text-ink hover:bg-surface"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/search"
            className={`py-5 hover:text-brand-blue ${
              pathname === '/search' ? 'font-semibold text-brand-blue' : ''
            }`}
          >
            {t('nav.all')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="hidden rounded-pill border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-surface md:inline-flex"
          >
            {t('nav.search')}
          </Link>

          <button
            onClick={() => setLocaleOpen(true)}
            className="hidden items-center gap-2 rounded-pill border border-line px-3 py-2 text-xs font-semibold text-ink hover:bg-surface md:inline-flex"
            aria-label="Change language and currency"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {language.toUpperCase()} / {currency}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-2 rounded-pill border border-line px-3 py-2 text-sm font-semibold text-ink hover:bg-surface"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue text-[11px] font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
              </button>

              {accountOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-card border border-line bg-white p-2 shadow-lg"
                  onMouseLeave={() => setAccountOpen(false)}
                >
                  <Link
                    href="/account"
                    className="block rounded px-3 py-2 text-sm text-ink hover:bg-surface"
                  >
                    {t('nav.account')}
                  </Link>
                  <Link
                    href="/account/settings"
                    className="block rounded px-3 py-2 text-sm text-ink hover:bg-surface"
                  >
                    {t('nav.settings')}
                  </Link>
                  <Link
                    href="/account/bookings"
                    className="block rounded px-3 py-2 text-sm text-ink hover:bg-surface"
                  >
                    {t('nav.bookings')}
                  </Link>
                  <Link
                    href="/account/reviews"
                    className="block rounded px-3 py-2 text-sm text-ink hover:bg-surface"
                  >
                    {t('nav.reviews')}
                  </Link>
                  {(user.role === 'vendor' || user.role === 'admin') && (
                    <Link
                      href="/vendor"
                      className="block rounded px-3 py-2 text-sm text-ink hover:bg-surface"
                    >
                      {t('nav.vendor')}
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block rounded px-3 py-2 text-sm text-ink hover:bg-surface"
                    >
                      {t('nav.admin')}
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      await logout();
                      window.location.href = '/';
                    }}
                    className="block w-full rounded px-3 py-2 text-left text-sm text-danger hover:bg-surface"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-pill border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-surface md:inline-flex"
              >
                {t('nav.login')}
              </Link>
              <Link
                href="/signup"
                className="rounded-pill bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blueHover"
              >
                {t('nav.signup')}
              </Link>
            </>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-1 rounded p-2 text-ink hover:bg-surface md:hidden"
            aria-label="Menu"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-white px-6 py-4 md:hidden">
          <Link href="/search" className="block py-2 text-sm font-medium text-ink">
            {t('nav.all')}
          </Link>
          <Link
            href="/search?category=tour"
            className="block py-2 text-sm font-medium text-ink"
          >
            Tours
          </Link>
          <Link
            href="/search?category=trek"
            className="block py-2 text-sm font-medium text-ink"
          >
            Treks
          </Link>
          <Link
            href="/search?category=culture"
            className="block py-2 text-sm font-medium text-ink"
          >
            Culture
          </Link>

          <div className="my-3 border-t border-line" />

          <button
            onClick={() => {
              setMenuOpen(false);
              setLocaleOpen(true);
            }}
            className="flex w-full items-center gap-2 py-2 text-left text-sm font-medium text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {language.toUpperCase()} / {currency}
          </button>

          <div className="my-3 border-t border-line" />

          {user ? (
            <>
              <Link href="/account" className="block py-2 text-sm font-medium text-ink">
                {t('nav.account')}
              </Link>
              <Link
                href="/account/settings"
                className="block py-2 text-sm font-medium text-ink"
              >
                {t('nav.settings')}
              </Link>
              <Link
                href="/account/bookings"
                className="block py-2 text-sm font-medium text-ink"
              >
                {t('nav.bookings')}
              </Link>
              <Link
                href="/account/reviews"
                className="block py-2 text-sm font-medium text-ink"
              >
                {t('nav.reviews')}
              </Link>
              {(user.role === 'vendor' || user.role === 'admin') && (
                <Link href="/vendor" className="block py-2 text-sm font-medium text-ink">
                  {t('nav.vendor')}
                </Link>
              )}
              {user.role === 'admin' && (
                <Link href="/admin" className="block py-2 text-sm font-medium text-ink">
                  {t('nav.admin')}
                </Link>
              )}
              <button
                onClick={async () => {
                  await logout();
                  window.location.href = '/';
                }}
                className="block w-full py-2 text-left text-sm font-medium text-danger"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-sm font-medium text-ink">
                {t('nav.login')}
              </Link>
              <Link href="/signup" className="block py-2 text-sm font-medium text-brand-blue">
                {t('nav.signup')}
              </Link>
            </>
          )}
        </div>
      )}

      <LocaleModal open={localeOpen} onClose={() => setLocaleOpen(false)} />
    </header>
  );
}