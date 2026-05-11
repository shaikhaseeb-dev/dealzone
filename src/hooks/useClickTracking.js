'use client';
import { useCallback } from 'react';

export function useClickTracking() {
  const trackClick = useCallback(async (productId, platform, affiliateUrl) => {
    try {
      // Fire-and-forget to our API
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, platform }),
      }).catch(() => {}); // silently fail — never block navigation
    } catch {
      // swallow errors
    }

    // Navigate to affiliate link
    if (affiliateUrl) {
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return { trackClick };
}
