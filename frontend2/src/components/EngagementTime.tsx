// frontend2\src\components\EngagementTime.tsx
'use client'

import { useEffect, useRef } from 'react'

export default function EngagementTime() {
  const start = useRef(Date.now())
  const sentRef = useRef(false)

  useEffect(() => {
    const sendTime = () => {
      if (sentRef.current) return
      
      const duration = Math.round((Date.now() - start.current) / 1000)

      // Only send if user was engaged for more than 10 seconds
      if (typeof window !== 'undefined' && (window as any).gtag && duration > 10) {
        sentRef.current = true
        
        // Use sendBeacon for reliable delivery on page unload
        if ('sendBeacon' in navigator) {
          const data = JSON.stringify({
            event_category: 'engagement',
            value: duration,
          })
          navigator.sendBeacon(
            `https://www.google-analytics.com/collect?t=event&ec=engagement&ea=engagement_time&ev=${duration}`,
            data
          )
        } else if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            (window as any).gtag('event', 'engagement_time', {
              event_category: 'engagement',
              value: duration,
            })
          })
        } else {
          (window as any).gtag('event', 'engagement_time', {
            event_category: 'engagement',
            value: duration,
          })
        }
      }
    }

    // Send on visibility change (tab switch) or before unload
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendTime()
      }
    }

    window.addEventListener('beforeunload', sendTime)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('beforeunload', sendTime)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return null
}
