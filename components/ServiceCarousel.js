'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Ico } from './Icons';
import { ServiceArt } from './ServiceArt';

// A scroll-snap carousel: swipe or use the arrows/dots; it also advances by itself, one card after another.
export default function ServiceCarousel({ items }) {
  const vp = useRef(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(items.length);
  const hold = useRef(false), seen = useRef(false), holdTimer = useRef(null);

  const geo = useCallback(() => {
    const v = vp.current, s = v && v.children[0];
    if (!s) return { step: 1, per: 1 };
    const gap = parseFloat(getComputedStyle(v).columnGap) || 20, step = s.offsetWidth + gap;
    return { step, per: Math.max(1, Math.round((v.clientWidth + gap) / step)) };
  }, []);
  const goTo = useCallback((i) => { const { step } = geo(); vp.current.scrollTo({ left: i * step, behavior: 'smooth' }); }, [geo]);
  const current = useCallback(() => Math.round(vp.current.scrollLeft / geo().step), [geo]);
  const next = useCallback((dir = 1) => { const n = pages; const c = current(); goTo(dir > 0 ? (c + 1 >= n ? 0 : c + 1) : (c - 1 < 0 ? n - 1 : c - 1)); }, [pages, current, goTo]);

  useEffect(() => {
    const v = vp.current; let raf;
    const measure = () => setPages(Math.max(1, items.length - geo().per + 1));
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setPage(current())); };
    measure(); v.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(measure); ro.observe(v);
    const io = new IntersectionObserver(([e]) => { seen.current = e.isIntersecting; }, { threshold: 0.25 }); io.observe(v);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = still ? null : setInterval(() => { if (!hold.current && seen.current) next(1); }, 4200);
    return () => { v.removeEventListener('scroll', onScroll); ro.disconnect(); io.disconnect(); clearInterval(timer); cancelAnimationFrame(raf); };
  }, [items.length, geo, current, next]);

  const pause = (ms = 0) => { hold.current = true; clearTimeout(holdTimer.current); if (ms) holdTimer.current = setTimeout(() => { hold.current = false; }, ms); };
  const resume = () => { clearTimeout(holdTimer.current); hold.current = false; };

  return (
    <div className="carousel" role="region" aria-roledescription="carousel" aria-label="Services"
      onMouseEnter={() => pause()} onMouseLeave={resume} onFocus={() => pause()} onBlur={resume} onTouchStart={() => pause(9000)}>
      <div className="car-view" ref={vp} tabIndex={0} onKeyDown={(e) => { if (e.key === 'ArrowRight') next(1); if (e.key === 'ArrowLeft') next(-1); }}>
        {items.map((s, i) => (
          <article className="slide g" key={s.t} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}>
            <div className="slide-art"><ServiceArt kind={s.i} id={i} /></div>
            <div className="slide-body">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.t}</h3>
              {s.tag && <div className="meta">{s.tag}</div>}
              <p>{s.d}</p>
              <a className="slide-link" href="#contact">Discuss this service <Ico n="arrow" /></a>
            </div>
          </article>
        ))}
      </div>
      <div className="car-ctrl">
        <button type="button" className="car-btn" onClick={() => next(-1)} aria-label="Previous service"><Ico n="arrowl" /></button>
        <div className="car-dots" role="tablist" aria-label="Choose a service">
          {Array.from({ length: pages }).map((_, i) => <button key={i} type="button" role="tab" aria-selected={i === page} aria-label={`Go to position ${i + 1}`} className={i === page ? 'on' : ''} onClick={() => goTo(i)} />)}
        </div>
        <button type="button" className="car-btn" onClick={() => next(1)} aria-label="Next service"><Ico n="arrow" /></button>
      </div>
    </div>
  );
}
