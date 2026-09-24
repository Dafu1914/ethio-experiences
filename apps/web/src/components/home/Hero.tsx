'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/i18n/useT';

export function Hero() {
  const router = useRouter();
  const t = useT();
  const [q, setQ] = useState('');
  const [when, setWhen] = useState('anytime');
  const [who, setWho] = useState('1');

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="bg-[#EBF2FF] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-center text-3xl font-extrabold leading-tight text-ink md:text-5xl">
          {t('hero.title')}
        </h1>

        {/* Search bar */}
        <form
          onSubmit={onSearch}
          className="mx-auto mt-8 flex max-w-3xl flex-col gap-2 rounded-card bg-white p-2 shadow-[0_6px_24px_rgba(10,26,47,0.10)] sm:flex-row sm:items-center sm:rounded-pill"
        >
          {/* Search input */}
          <div className="flex flex-1 items-center gap-2 rounded-pill bg-white px-4 py-3">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('hero.placeholder')}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-line sm:block" />

          {/* When */}
          <div className="flex items-center gap-2 px-4 py-3 sm:py-0">
            <select
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="bg-transparent text-sm font-medium text-ink outline-none"
            >
              <option value="anytime">{t('hero.anytime')}</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-line sm:block" />

          {/* Participants */}
          <div className="flex items-center gap-2 px-4 py-3 sm:py-0">
            <select
              value={who}
              onChange={(e) => setWho(e.target.value)}
              className="bg-transparent text-sm font-medium text-ink outline-none"
            >
              <option value="1">{t('hero.participant')}</option>
              <option value="2">2 participants</option>
              <option value="3">3 participants</option>
              <option value="4">4 participants</option>
              <option value="5">5+ participants</option>
            </select>
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="rounded-pill bg-brand-blue px-8 py-3 text-sm font-bold text-white transition hover:bg-brand-blueHover sm:px-7"
          >
            {t('hero.search')}
          </button>
        </form>
      </div>
    </section>
  );
}