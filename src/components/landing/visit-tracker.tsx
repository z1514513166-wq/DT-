'use client';

import { useEffect } from 'react';

export default function VisitTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {
      // Silently fail — tracking should not break the page
    });
  }, [slug]);

  return null;
}
