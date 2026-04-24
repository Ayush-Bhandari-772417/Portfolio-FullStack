'use client';
import { useEffect } from 'react';
import { hotjar } from 'react-hotjar';
import { ANALYTICS_CONFIG } from '../config';

export default function HotjarTracker() {
  useEffect(() => {
    if (ANALYTICS_CONFIG.hotjarId) {
      hotjar.initialize({
        id: Number(ANALYTICS_CONFIG.hotjarId),
        sv: 6,
      });
    }
  }, []);
  return null;
}
