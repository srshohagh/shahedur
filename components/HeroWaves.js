'use client';
import { useEffect, useRef } from 'react';

// ===== SPEED SETTING (change this number) =====
const SPEED = 1.6; // 1 = calm, 2 = fast

// Each ribbon is a bundle of thin lines; phase shifts make it twist like a swirl.
const RIBBONS = [
  { y: 0.6,  amp: 0.12, k: 1.5, speed: 0.45,  twist: 1.6, spread: 0.2,  lines: 16, rgb: '167,235,242', a: 0.8 },
  { y: 0.52, amp: 0.1,  k: 2.2, speed: -0.35, twist: 2.1, spread: 0.16, lines: 14, rgb: '84,172,191', a: 0.7 },
  { y: 0.68, amp: 0.09, k: 2.9, speed: 0.6,   twist: 1.2, spread: 0.14, lines: 12, rgb: '38,101,140',  a: 0.75 },
  { y: 0.58, amp: 0.15, k: 1.1, speed: -0.25, twist: 2.6, spread: 0.24, lines: 12, rgb: '84,172,191',  a: 0.9 },
];

export default function HeroWaves() {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d'), host = c.parentElement;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, raf = 0, visible = true, mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5, fade = null;

    const resize = () => {
      const r = host.getBoundingClientRect();
      W = r.width; H = r.height;
      c.width = W; c.height = H;              // 1x resolution: soft waves don't need retina pixels
      fade = ctx.createLinearGradient(0, H * 0.7, 0, H);
      fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)');
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      const step = Math.max(10, Math.round(W / 100));
      for (const r of RIBBONS) {
        const base = H * (r.y + (my - 0.5) * 0.06);
        for (let j = 0; j < r.lines; j++) {
          const f = j / (r.lines - 1), edge = 1 - Math.abs(f - 0.5) * 2;
          ctx.beginPath();
          for (let x = 0; x <= W + step; x += step) {
            const u = (x / W) * Math.PI * 2;
            const phase = t * r.speed + f * r.twist + (mx - 0.5) * 1.2;
            const y = base + H * r.amp * Math.sin(u * r.k + phase) +
              H * r.spread * (f - 0.5) * Math.cos(u * r.k * 0.6 - t * r.speed * 0.7 + 1.3);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(${r.rgb},${(0.08 + 0.4 * edge) * r.a})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
      }
      // fade the bottom edge (much cheaper than a CSS mask on a moving canvas)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = fade; ctx.fillRect(0, H * 0.7, W, H * 0.3);
      ctx.globalCompositeOperation = 'source-over';
    };

    const loop = (ms) => { if (!visible) return; draw((ms / 1000) * SPEED); raf = requestAnimationFrame(loop); };
    const onMove = (e) => { const r = host.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; };

    resize();
    const ro = new ResizeObserver(() => { resize(); if (still) draw(2); });
    ro.observe(host);
    // stop animating while the header is scrolled out of view
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !still) { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); }
    });
    io.observe(host);
    if (still) draw(2); else { raf = requestAnimationFrame(loop); window.addEventListener('pointermove', onMove, { passive: true }); }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', onMove); };
  }, []);

  return <canvas className="waves" ref={ref} aria-hidden="true" />;
}
