'use client';
import dynamic from 'next/dynamic';
import { getEnabledTools } from '@/lib/analytics';

const GoogleAnalyticsTracker = dynamic(() => import('../trackers/GoogleAnalytics'), { ssr: false });
const EngagementTimeTracker = dynamic(() => import('../trackers/EngagementTime'), { ssr: false });
const ScrollDepthTracker = dynamic(() => import('../trackers/ScrollDepth'), { ssr: false });
const RecaptchaTracker = dynamic(() => import('../trackers/RecaptchaScript'), { ssr: false });
const HotjarTracker = dynamic(() => import('../trackers/HotjarTracker'), { ssr: false });
const ClarityTracker = dynamic(() => import('../trackers/Clarity'), { ssr: false });
const WebVitalsTracker = dynamic(() => import('../trackers/WebVitals'), { ssr: false });

export default function AnalyticsProvider() {
  const enabled = getEnabledTools();
  return (
    <>
      {enabled.ga && <GoogleAnalyticsTracker />}
      {enabled.recaptcha && <RecaptchaTracker />}
      <ScrollDepthTracker />
      <EngagementTimeTracker />
      {enabled.hotjar && <HotjarTracker />}
      {enabled.clarity && <ClarityTracker />}
      {enabled.ga && <WebVitalsTracker />}
    </>
  );
}
