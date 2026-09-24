'use client';

import { useLocale } from '@/context/LocaleContext';
import { t as translate } from './strings';

export function useT() {
  const { language } = useLocale();
  return (key: string) => translate(language, key);
}