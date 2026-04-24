export const ANALYTICS_CONFIG = {
  ga: process.env.NEXT_PUBLIC_GA_ID || '',
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || '',
  semrushId: process.env.NEXT_PUBLIC_SEMRUSH_ID || '',
  recaptchaKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
} as const;
