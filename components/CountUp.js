'use client';
import { useEffect, useRef, useState } from 'react';

export default function CountUp({ to = 30, prefix = '', suffix = '', duration = 1400 }) {
  const ref = useRef(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const f = Math.min(1, (t - t0) / duration);
        setN(Math.round(to * (1 - Math.pow(1 - f, 3))));
        if (f < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);
  return <span ref={ref}>{prefix}{n.toLocaleString('en-US')}{suffix}</span>;
}
