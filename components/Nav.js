'use client';
import { useEffect, useRef, useState } from 'react';

// true  = the bar slides away when you scroll down and slides back when you scroll up
// false = the bar simply scrolls away with the page
const SMART = true;

const LINKS = [
  ['about', 'About'], ['results', 'Results'], ['experience', 'Experience'], ['services', 'Services'],
  ['creative', 'Content'], ['skills', 'Skills'], ['education', 'Education'],
];

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('');
  const [pill, setPill] = useState({ x: 0, w: 0, on: false });
  const listRef = useRef(null);

  // hide on scroll down, show on scroll up, and track the section being read
  useEffect(() => {
    let last = window.scrollY, ticking = false;
    const ids = [...LINKS.map(([id]) => id), 'contact'];
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (SMART) setHidden(y > last && y > 120);
        last = y;
        const line = window.innerHeight * 0.35;
        let cur = '';
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top <= line && r.bottom > line) cur = id;
        }
        setActive(cur);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // slide the highlight under the active link
  useEffect(() => {
    const list = listRef.current;
    const el = list && list.querySelector(`[data-id="${active}"]`);
    if (!el) return setPill((p) => ({ ...p, on: false }));
    setPill({ x: el.offsetLeft, w: el.offsetWidth, on: true });
    list.scrollTo({ left: el.offsetLeft - list.clientWidth / 2 + el.offsetWidth / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <div className={`topnav ${SMART ? '' : 'flow'} ${hidden ? 'is-hidden' : ''}`} onFocusCapture={() => setHidden(false)}>
      <nav className="navpill" aria-label="Main">
        <ul ref={listRef}>
          {pill.on && <li className="slider" aria-hidden="true" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />}
          {LINKS.map(([id, label]) => (
            <li key={id}>
              <a data-id={id} href={`#${id}`} className={active === id ? 'on' : ''} aria-current={active === id ? 'true' : undefined}>{label}</a>
            </li>
          ))}
        </ul>
        <a className="btn navcta" href="#contact">Contact</a>
      </nav>
    </div>
  );
}
