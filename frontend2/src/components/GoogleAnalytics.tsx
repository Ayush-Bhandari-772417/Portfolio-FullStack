// frontend2\src\components\GoogleAnalytics.tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  useEffect(() => {
    if (!gaId || typeof window === 'undefined' || !window.gtag) return

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    
    // Use requestIdleCallback for non-blocking updates
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        window.gtag('config', gaId, {
          page_path: url,
        })
      })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        window.gtag('config', gaId, {
          page_path: url,
        })
      }, 0)
    }
  }, [pathname, searchParams, gaId])

  return null
}
