'use client';
import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;
const ease = (x) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
const line = (ax, ay, bx, by, n) =>
  Array.from({ length: n }, (_, i) => { const f = n === 1 ? 0 : i / (n - 1); return [ax + (bx - ax) * f, ay + (by - ay) * f]; });
const ring = (cx, cy, r, n, rot = 0) =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(rot + (i / n) * TAU), cy + r * Math.sin(rot + (i / n) * TAU)]);

const ORBITS = [{ a: 0.5, b: 0.19, r: 0 }, { a: 0.5, b: 0.19, r: Math.PI / 3 }, { a: 0.5, b: 0.19, r: -Math.PI / 3 }];

// Each scene returns target points (or null = "not built yet"). Unplaced points float freely.
const SCENES = {
  hero: { link: 0.2, fade: 1, speed: 1, drift: 1, fn: () => [] },

  // About: calm, sparse, slow-moving network so the text stays easy to read
  about: { link: 0.15, fade: 0.45, speed: 0.6, drift: 0.4, fn: () => [] },

  // Results: bars and a trend line that keep rising
  results: { link: 0.095, fade: 0.75, speed: 1, drift: 0.5, fn: (t, m, cx, cy) => {
    const g = ease((t % 7) / 4), base = cy + m * 0.4, s = m * 0.062, out = [];
    [3, 5, 6, 8, 10, 13].forEach((h, i) => {
      const x = cx + (i - 2.5) * m * 0.15;
      for (let k = 0; k < h; k++) out.push(k < h * g ? [x, base - k * s] : null);
    });
    const ax = cx - m * 0.45, ay = base + s * 0.6;
    out.push(...line(ax, ay, cx + m * 0.45, ay, 12), ...line(ax, ay, ax, base - m * 0.85, 12));
    line(cx - m * 0.38, base - m * 0.1, cx + m * 0.42, base - m * 0.85, 14).forEach((p, i) => out.push(i < 14 * g ? p : null));
    return out;
  } },

  // Experience: a staircase career path climbing to a goal
  experience: { link: 0.075, fade: 0.7, speed: 0.85, drift: 0.5, fn: (t, m, cx, cy) => {
    const g = ease((t % 8) / 5.5), sx = m * 0.13, sy = m * 0.1, n = 7;
    const x0 = cx - (n * sx) / 2, y0 = cy + (n * sy) / 2, path = [];
    for (let i = 0; i < n; i++) {
      path.push(...line(x0 + i * sx, y0 - i * sy, x0 + (i + 1) * sx, y0 - i * sy, 3).slice(0, 2));
      path.push(...line(x0 + (i + 1) * sx, y0 - i * sy, x0 + (i + 1) * sx, y0 - (i + 1) * sy, 3).slice(0, 2));
    }
    const out = path.map((p, i) => (i < path.length * g ? p : null));
    out.push(...ring(x0 + n * sx, y0 - n * sy - m * 0.07, m * 0.045, 8, t));
    return out;
  } },

  // Services: an atom, a connected nucleus with electrons orbiting three tilted rings
  services: { link: 0.09, fade: 0.75, speed: 0.8, drift: 0.5,
    fn: (t, m, cx, cy) => {
      const out = [...ring(cx, cy, m * 0.05, 7, t * 0.6), [cx, cy]];
      ORBITS.forEach((o, k) => {
        for (let i = 0; i < 9; i++) {
          const th = (i / 9) * TAU + t * (0.6 + k * 0.18) * (k % 2 ? -1 : 1);
          const ex = Math.cos(th) * o.a * m, ey = Math.sin(th) * o.b * m;
          out.push([cx + ex * Math.cos(o.r) - ey * Math.sin(o.r), cy + ex * Math.sin(o.r) + ey * Math.cos(o.r)]);
        }
      });
      return out;
    },
    decor: (x, t, m, cx, cy) => {
      x.save(); x.globalAlpha *= Math.min(1, t / 1); x.lineWidth = 1.2; x.strokeStyle = 'rgba(167,235,242,.5)';
      ORBITS.forEach((o) => { x.beginPath(); x.ellipse(cx, cy, o.a * m, o.b * m, o.r, 0, TAU); x.stroke(); });
      x.restore();
    } },

  // Content and video: a spinning reel around a play button
  creative: { link: 0.095, fade: 0.7, speed: 1, drift: 0.5, fn: (t, m, cx, cy) => {
    const r = m * 0.38, p = 1 + Math.sin(t * 2) * 0.04, out = ring(cx, cy, r, 30, t * 0.25);
    const tri = [[cx - r * 0.28 * p, cy - r * 0.4 * p], [cx - r * 0.28 * p, cy + r * 0.4 * p], [cx + r * 0.44 * p, cy]];
    for (let i = 0; i < 3; i++) out.push(...line(...tri[i], ...tri[(i + 1) % 3], 7).slice(0, 6));
    out.push(...ring(cx, cy, r * 1.12, 14, -t * 0.4));
    return out;
  } },

  // Skills: a light, rotating globe (kept faint so the text stays readable)
  skills: { link: 0.2, fade: 0.4, speed: 0.6, drift: 0.4, fn: (t, m, cx, cy) => {
    const R = m * 0.4, n = 46, out = [];
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2, rad = Math.sqrt(1 - y * y), th = i * 2.399963 + t * 0.35;
      const sc = 1 / (1.6 - Math.sin(th) * rad * 0.4);
      out.push([cx + Math.cos(th) * rad * R * sc, cy + y * R * sc]);
    }
    return out;
  } },

  // Education (physics): an atom with orbiting electrons
  education: { link: 0.1, fade: 0.6, speed: 0.8, drift: 0.5, fn: (t, m, cx, cy) => {
    const out = ring(cx, cy, m * 0.035, 6, t);
    [0, 1, 2].forEach((k) => {
      const rot = (k * Math.PI) / 3 + Math.PI / 6, a = m * 0.42, b = m * 0.15;
      for (let i = 0; i < 22; i++) {
        const th = (i / 22) * TAU + t * (0.5 + k * 0.15), x = Math.cos(th) * a, y = Math.sin(th) * b;
        out.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
      }
    });
    return out;
  } },

  // Contact: a smaller, glowing envelope with signal rings kept at a clear distance
  contact: { link: 0.095, fade: 1, speed: 1, drift: 0.6, anchor: '[data-anim="contact"]',
    fn: (t, m, cx, cy) => {
      const w = m * 0.5, h = m * 0.34, bob = Math.sin(t * 1.2) * m * 0.015, x0 = cx - w / 2, y0 = cy - h / 2 + bob;
      const c = [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], out = [];
      for (let i = 0; i < 4; i++) out.push(...line(...c[i], ...c[(i + 1) % 4], i % 2 ? 5 : 7).slice(0, -1));
      out.push(...line(x0, y0, cx, cy + bob, 5).slice(1), ...line(x0 + w, y0, cx, cy + bob, 5).slice(1, -1));
      for (let k = 0; k < 3; k++) {
        const R = m * (0.5 + ((t * 0.1 + k / 3) % 1) * 0.1);
        for (let i = 0; i < 14; i++) { const a = (i / 14) * TAU + k * 0.7; out.push([cx + R * Math.cos(a), cy + R * 0.5 * Math.sin(a)]); }
      }
      return out;
    },
    decor: (x, t, m, cx, cy) => {
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
      x.save(); x.globalAlpha *= Math.min(1, t / 1) * (0.55 + 0.45 * pulse);
      const g = x.createRadialGradient(cx, cy, m * 0.04, cx, cy, m * 0.42);
      g.addColorStop(0, 'rgba(167,235,242,.30)'); g.addColorStop(0.55, 'rgba(84,172,191,.13)'); g.addColorStop(1, 'rgba(84,172,191,0)');
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, m * 0.42, 0, TAU); x.fill(); x.restore();
    } },
};
const IDS = ['about', 'results', 'experience', 'services', 'creative', 'skills', 'education', 'contact'];

// ===== SPEED SETTINGS (change these two numbers) =====
const SPEED = 1.4;    // how fast the shapes animate (1 = normal, 2 = twice as fast)
const FOLLOW = 0.14;  // how quickly dots fly into each new shape (0.05 slow ... 0.3 very fast)

const BUCKETS = 12;
export default function NetworkBackground() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, dpr, raf, ps = [], scene = 'hero', enter = 0, link = 150, fadeNow = 1;
    const segs = Array.from({ length: BUCKETS }, () => []);

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = W < 700 ? 90 : 100;
      ps = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, on: false }));
    };
    const pick = () => {
      const mid = window.innerHeight * 0.35;
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 6) return 'contact';
      for (const id of IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) return id;
      }
      return 'hero';
    };
    const onScroll = () => { const k = pick(); if (k !== scene) { scene = k; enter = performance.now() / 1000; } };

    const draw = (ms) => {
      let m = Math.min(W, H) * 0.82, cx = W < 760 ? W * 0.5 : W * 0.66, cy = H * 0.52;
      const sc = SCENES[scene];
      // a scene can anchor itself to an empty slot on the page so it is always visible and aligned
      if (sc.anchor) {
        const el = document.querySelector(sc.anchor), r = el && el.getBoundingClientRect();
        if (r && r.width > 40) { cx = r.left + r.width / 2; cy = r.top + r.height / 2; m = Math.min(r.width / 0.9, r.height / 0.62, m * 1.2); }
      }
      const spd = SPEED * (sc.speed ?? 1), drift = sc.drift ?? 0.6;
      const pts = still ? [] : sc.fn((ms / 1000 - enter) * spd, m, cx, cy, W, H);
      link += ((scene === 'hero' ? 150 : typeof sc.link === 'function' ? sc.link(m, W) : sc.link * m) - link) * 0.1;
      const L2 = link * link;
      const fTarget = scene === 'hero' ? 1 : typeof sc.fade === 'function' ? sc.fade(W) : sc.fade ?? 0.8;
      fadeNow += (fTarget - fadeNow) * 0.08;
      x.clearRect(0, 0, W, H);
      x.globalAlpha = fadeNow;

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i], tg = pts[i];
        p.on = !!tg;
        if (tg) { p.x += (tg[0] - p.x) * FOLLOW; p.y += (tg[1] - p.y) * FOLLOW; }
        else if (!still) {
          p.x += p.vx * drift; p.y += p.vy * drift;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
      }
      // collect sticks into alpha buckets, then draw each bucket in ONE stroke
      for (let b = 0; b < BUCKETS; b++) segs[b].length = 0;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        for (let j = i + 1; j < ps.length; j++) {
          const q = ps[j], dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
          if (d2 < L2) {
            const lvl = Math.min(5, Math.floor((1 - Math.sqrt(d2) / link) * 6));
            segs[(p.on && q.on ? 6 : 0) + lvl].push(p.x, p.y, q.x, q.y);
          }
        }
      }
      const freeA = scene === 'hero' ? 0.24 : 0.07;
      for (let b = 0; b < BUCKETS; b++) {
        const a = segs[b];
        if (!a.length) continue;
        const both = b >= 6, lvl = b % 6;
        x.strokeStyle = `rgba(167,235,242,${(both ? 0.85 : freeA) * ((lvl + 0.5) / 6)})`;
        x.lineWidth = both ? 2.1 : 1.4;
        x.beginPath();
        for (let k = 0; k < a.length; k += 4) { x.moveTo(a[k], a[k + 1]); x.lineTo(a[k + 2], a[k + 3]); }
        x.stroke();
      }
      if (sc.decor && !still) sc.decor(x, (ms / 1000 - enter) * spd, m, cx, cy, W, H);
      // dots: three batched fills (glow, placed, free) instead of per-dot shadows
      const pulse = scene === 'contact' ? 0.5 + 0.5 * Math.sin((ms / 1000 - enter) * spd * 2.2) : 0;
      x.fillStyle = scene === 'contact' ? `rgba(84,172,191,${0.14 + 0.2 * pulse})` : 'rgba(84,172,191,.2)'; x.beginPath();
      for (const p of ps) if (p.on) { x.moveTo(p.x + 9, p.y); x.arc(p.x, p.y, 9, 0, TAU); }
      x.fill();
      x.fillStyle = '#d6f6fa'; x.beginPath();
      for (const p of ps) if (p.on) { x.moveTo(p.x + 4, p.y); x.arc(p.x, p.y, 4, 0, TAU); }
      x.fill();
      x.fillStyle = 'rgba(167,235,242,.4)'; x.beginPath();
      for (const p of ps) if (!p.on) { x.moveTo(p.x + 2.2, p.y); x.arc(p.x, p.y, 2.2, 0, TAU); }
      x.fill();
      // frosted glass: hide the structure behind content cards so it never competes with text
      x.save(); x.globalAlpha = 1; x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,.9)'; x.beginPath();
      document.querySelectorAll('.g, .mailcard').forEach((el) => {
        const q = el.getBoundingClientRect();
        if (q.bottom < 0 || q.top > H || q.width < 2) return;
        if (x.roundRect) x.roundRect(q.left, q.top, q.width, q.height, 20); else x.rect(q.left, q.top, q.width, q.height);
      });
      x.fill(); x.restore();
      if (!still) raf = requestAnimationFrame(draw);
    };

    size(); onScroll(); raf = requestAnimationFrame(draw);
    window.addEventListener('resize', size);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); window.removeEventListener('scroll', onScroll); };
  }, []);
  return <canvas id="net" ref={ref} aria-hidden="true" />;
}
