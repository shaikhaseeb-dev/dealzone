'use client';
import { useState, useEffect } from 'react';
import { timeUntil } from '@/lib/utils';

export function useCountdown(isoString) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (!isoString) return;
    setDisplay(timeUntil(isoString));
    const interval = setInterval(() => {
      setDisplay(timeUntil(isoString));
    }, 1000);
    return () => clearInterval(interval);
  }, [isoString]);

  return display;
}
