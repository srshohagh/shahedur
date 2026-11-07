'use client';
import { useEffect } from 'react';

// Tracks the pointer over any .btn so its CSS spotlight follows the cursor.
export default function GlowEffects() {
  useEffect(() => {
    const move = (e) => {
      const b = e.target.closest && e.target.closest('.btn');
      if (!b) return;
      const r = b.getBoundingClientRect();
      b.style.setProperty('--x', `${e.clientX - r.left}px`);
      b.style.setProperty('--y', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', move, { passive: true });
    return () => document.removeEventListener('pointermove', move);
  }, []);
  return null;
}
