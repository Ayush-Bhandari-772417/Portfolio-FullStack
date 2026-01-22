// frontend2\src\components\ScrollDepth.tsx
'use client'

import { useEffect, useRef } from 'react'

export default function ScrollDepth() {
  const fired = useRef(new Set<number>())
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    // Throttle scroll events to reduce performance impact
    const onScroll = () => {
      if (timeoutRef.current) {
        return
      }

      timeoutRef.current = window.setTimeout(() => {
        const scrollTop = window.scrollY
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight

        const scrollPercent = Math.round((scrollTop / docHeight) * 100)

        ;[25, 50, 75, 100].forEach((mark) => {
          if (scrollPercent >= mark && !fired.current.has(mark)) {
            fired.current.add(mark)

            // Use requestIdleCallback for non-blocking analytics
            if (typeof window !== 'undefined' && (window as any).gtag) {
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                  (window as any).gtag('event', 'scroll_depth', {
                    event_category: 'engagement',
                    event_label: `${mark}%`,
                    value: mark,
                  })
                })
              } else {
                setTimeout(() => {
                  (window as any).gtag('event', 'scroll_depth', {
                    event_category: 'engagement',
                    event_label: `${mark}%`,
                    value: mark,
                  })
                }, 0)
              }
            }
          }
        })

        timeoutRef.current = null
      }, 100) // Throttle to max once per 100ms
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return null
}
