// frontend2\src\app\layout.tsx
import { Suspense } from 'react'
import Navbar from "@/components/commonSections/Navbar";
import '@/styles/globals.css';
import Footer from "@/components/commonSections/Footer";
import Script from "next/script";
import { Metadata } from 'next';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { getBootstrap, getDisplayLimit } from '@/lib/data';
import { normalizeSettingsFromBootstrap } from '@/lib/normalizeSettings';
import { AnalyticsProvider } from '@/components/analytics';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Ayush Bhandari | Portfolio",
    template: "%s | Ayush Bhandari",
  },
  description: "Portfolio & creations of Ayush Bhandari",
  icons: {
    icon: '/minilogo.png',
    apple: '/minilogo.png',
  },
  openGraph: {
    type: 'website',
    url: baseUrl,
    siteName: 'Ayush Bhandari',
    title: 'Ayush Bhandari | Portfolio',
    description: 'Portfolio & creations of Ayush Bhandari',
    images: [
      { url: '/minilogo.png', width: 1200, height: 630, alt: 'Ayush Portfolio' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayush Bhandari | Portfolio',
    description: 'Portfolio & creations of Ayush Bhandari',
    images: ['/minilogo.png'],
    creator: '@AyushBhandari',
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const bootstrap = await getBootstrap();
  const settings = normalizeSettingsFromBootstrap(bootstrap);
  const { social_media, } = bootstrap;

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gscid = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content={gscid} />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        {/* Load KaTeX CSS asynchronously to prevent blocking render */}
        <Script id="katex-css-loader" strategy="lazyOnload">
          {`
            if (!document.querySelector('link[href*="katex"]')) {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.27/dist/katex.min.css';
              link.crossOrigin = 'anonymous';
              document.head.appendChild(link);
            }
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-blue-100 text-slate-800 antialiased">
        {/* Google Analytics with consent mode and lazy loading */}
        {gaId && (
          <>
            <Script
              id="gtag-init"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    'anonymize_ip': true,
                    'cookie_flags': 'SameSite=None;Secure',
                    'cookie_expires': 63072000
                  });
                `,
              }}
            />
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="lazyOnload"
            />
          </>
        )}

        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>

        <ReactQueryProvider>
          <Navbar settings={settings} />
          <main className="min-h-screen flex flex-col" role="main">{children}</main>
          <Footer social_media={social_media.slice(0, getDisplayLimit(settings, 'home', 'social_media', 6))} settings={settings} />
        </ReactQueryProvider>
      </body>
      {/* Load reCAPTCHA with optimized strategy */}
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
      )}
    </html>
  );
}