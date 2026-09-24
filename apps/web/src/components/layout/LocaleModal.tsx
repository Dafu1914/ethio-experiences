'use client';

import { useState } from 'react';
import { useLocale, Language, Currency } from '@/context/LocaleContext';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'am', label: 'Amharic', native: 'አማርኛ' },
  { code: 'om', label: 'Afaan Oromoo', native: 'Afaan Oromoo' },
];

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: 'ETB', label: 'Ethiopian Birr' },
  { code: 'USD', label: 'US Dollar' },
  { code: 'EUR', label: 'Euro' },
];

export function LocaleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { language, currency, setLanguage, setCurrency } = useLocale();
  const [tab, setTab] = useState<'language' | 'currency'>('language');

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 md:items-center"
      onClick={onClose}
    >
      <div
        className="mt-16 w-full max-w-lg rounded-card bg-white shadow-xl md:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex gap-1 rounded-pill bg-surface p-1 text-sm font-semibold">
            <button
              onClick={() => setTab('language')}
              className={`flex items-center gap-2 rounded-pill px-4 py-1.5 transition ${
                tab === 'language' ? 'bg-white text-brand-blue shadow-sm' : 'text-muted'
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Language
            </button>
            <button
              onClick={() => setTab('currency')}
              className={`flex items-center gap-2 rounded-pill px-4 py-1.5 transition ${
                tab === 'currency' ? 'bg-white text-brand-blue shadow-sm' : 'text-muted'
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <path d="M8 10h5a2 2 0 0 1 0 4H8" />
              </svg>
              Currency
            </button>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1 text-muted hover:bg-surface"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {tab === 'language' &&
            LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLanguage(l.code);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded px-4 py-3 text-left text-sm hover:bg-surface ${
                  language === l.code ? 'font-semibold text-brand-blue' : 'text-ink'
                }`}
              >
                <span>{l.native}</span>
                {language === l.code && (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}

          {tab === 'currency' &&
            CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c.code);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded px-4 py-3 text-left text-sm hover:bg-surface ${
                  currency === c.code ? 'font-semibold text-brand-blue' : 'text-ink'
                }`}
              >
                <span>
                  {c.code} <span className="text-muted">· {c.label}</span>
                </span>
                {currency === c.code && (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}