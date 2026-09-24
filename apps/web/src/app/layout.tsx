import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LocaleProvider } from '@/context/LocaleContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { Analytics } from '@/components/layout/Analytics';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ethio Experiences — Book Tours & Activities in Ethiopia',
    template: '%s · Ethio Experiences',
  },
  description:
    'Discover and book unforgettable tours, treks, and cultural experiences across Ethiopia. Lalibela rock churches, Simien Mountains, Danakil Depression, Omo Valley and more.',
  keywords: [
    'Ethiopia tours',
    'Ethiopia travel',
    'Lalibela tours',
    'Simien Mountains trek',
    'Danakil Depression',
    'Omo Valley',
    'Addis Ababa activities',
    'Ethiopian coffee ceremony',
    'Ethiopia travel booking',
  ],
  authors: [{ name: 'Ethio Experiences' }],
  creator: 'Ethio Experiences',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['am_ET', 'om_ET'],
    url: SITE_URL,
    siteName: 'Ethio Experiences',
    title: 'Ethio Experiences — Book Tours & Activities in Ethiopia',
    description: 'Book tours, treks, and cultural experiences across Ethiopia.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ethio Experiences — Ethiopian tours',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ethio Experiences',
    description: 'Book Ethiopian tours and experiences.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#FF5533',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <LocaleProvider>
          <AuthProvider>
            <ScrollToTop />
            <Analytics />
            <Header />
            <div className="flex-1 pb-16 md:pb-0">{children}</div>
            <Footer />
            <MobileBottomNav />
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}