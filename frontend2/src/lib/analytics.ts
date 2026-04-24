'use client';
import { ANALYTICS_CONFIG } from '@/components/analytics/config';

export function getEnabledTools() {
  return {
    ga: !!ANALYTICS_CONFIG.ga,
    hotjar: !!ANALYTICS_CONFIG.hotjarId,
    clarity: !!ANALYTICS_CONFIG.clarityId,
    recaptcha: !!ANALYTICS_CONFIG.recaptchaKey
  };
}
