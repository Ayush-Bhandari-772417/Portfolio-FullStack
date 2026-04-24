'use client';

import Script from 'next/script';
import { ANALYTICS_CONFIG } from '../config';
import { useEffect } from 'react';

export default function ClarityTracker() {
  const clarityId = ANALYTICS_CONFIG.clarityId;

  // Fallback script injection if needed
  useEffect(() => {
    if (clarityId && typeof window !== 'undefined') {
      (function(c, l, a, r, i, t, y) {
        c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", clarityId);
    }
  }, [clarityId]);

  if (!clarityId) return null;

  return (
    <>
      {/* Primary Clarity script */}
      <Script
        id="microsoft-clarity"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `,
        }}
      />
      
      {/* Consent mode integration (optional) */}
      <Script id="clarity-consent" strategy="lazyOnload">
        {`
          window.clarity('consent', true);
        `}
      </Script>
    </>
  );
}
