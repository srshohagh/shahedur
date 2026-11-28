# Navigation update: guide

This pack replaces only the navigation bar. Nothing else on the site changes.

## What the new navigation does
- No logo and no name: just the links and a **Contact** button in a floating glass bar.
- **It moves when you scroll.** Scroll down and the bar slides up and away. Scroll up and it slides back.
- A highlight slides under the section you are reading (About, Results, Experience and so on).
- Hovering a link gives a white glow. The bar scrolls sideways on phones.
- Want it to simply scroll away with the page instead? Open `Nav.js` and change `const SMART = true;` to `const SMART = false;`.

## Files in this pack
- `Nav.js`: the new navigation component
- `nav.css`: the styles for it

## How to add it to your existing code (5 steps)

**Step 1. Add the component.**
In your project, open the `components` folder and add `Nav.js` (the file from this pack).

**Step 2. Use it in `app/page.js`.**
- At the top of the file, add this line with the other imports:
  `import Nav from '../components/Nav';`
- Find the old navigation block. It starts with `<div className="navwrap">` and ends with the matching `</div>` just before `<header className="top" id="top">`. Delete that whole block.
- In its place, write: `<Nav />`
  (it goes right after `<GlowEffects />` and before the `<header ...>` line).

**Step 3. Remove the old navigation styles in `app/globals.css`.**
Delete these old rules (search for each name):
- `.navwrap`, `.bar`, `.logo`, `.logo b`, `.mark`
- `nav{...}`, `nav a{...}`, `nav a:hover...` and the old `@keyframes whiteglow`
- `.navcta`
- inside `@media(max-width:1000px)` the line `nav a{padding:7px 9px}`
- inside `@media(max-width:820px)` the line `nav{display:none}.navcta{margin-left:auto}`
- inside `@media(prefers-reduced-motion:reduce)` the line `nav a:hover{animation:none}`

**Step 4. Add the new styles.**
Open `nav.css` from this pack, copy everything, and paste it at the very end of `app/globals.css`.
(It also changes `.hero` top padding to `96px`, because the bar now floats over the page instead of taking up space. If your file still has an older `.hero{...padding-top:22px...}` rule, the new one at the bottom wins automatically.)

**Step 5. Check the section IDs.**
The links jump to sections by ID. Your sections need these IDs: `about`, `results`, `experience`, `services`, `creative`, `skills`, `education`, `contact`. If you do not have an About section yet, delete the `['about', 'About']` line near the top of `Nav.js`. To add, remove or rename a link, edit the `LINKS` list at the top of `Nav.js`.

Then commit the three changed files (`components/Nav.js`, `app/page.js`, `app/globals.css`) to GitHub, wait for the green tick in the Actions tab, and press Ctrl+Shift+R on your site.

## If something looks wrong
- **Two navigation bars:** the old block in `page.js` was not fully deleted (Step 2).
- **Bar covers the headline:** the new `.hero{padding-top:96px}` rule did not land at the end of the CSS (Step 4).
- **Highlight does not move:** a section ID is missing (Step 5).
- **Red cross in Actions:** open the run, click the red box, and read the first error line. A missing `import Nav` line is the usual cause.

---

## Full code: `components/Nav.js`
```js
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

```

## Full code: `nav.css`
```css
/* ================= floating, moving navigation ================= */
.topnav{position:fixed;top:14px;left:0;right:0;z-index:50;display:flex;justify-content:center;padding:0 14px;pointer-events:none;
  transition:transform .4s cubic-bezier(.2,.8,.2,1),opacity .4s}
.topnav.flow{position:absolute}
.topnav.is-hidden{transform:translateY(-150%);opacity:0}
.navpill{pointer-events:auto;display:flex;align-items:center;gap:6px;max-width:100%;padding:6px 6px 6px 8px;border-radius:999px;
  background:rgba(1,28,64,.88);border:1px solid var(--line);box-shadow:0 12px 34px rgba(0,8,26,.5),inset 0 1px 0 rgba(167,235,242,.1)}
.navpill ul{list-style:none;margin:0;padding:0;display:flex;gap:2px;position:relative;overflow-x:auto;scrollbar-width:none;min-width:0}
.navpill ul::-webkit-scrollbar{display:none}
.navpill li{flex:none}
.navpill a:not(.btn){display:block;position:relative;z-index:1;padding:9px 14px;border-radius:999px;color:var(--mute);font-size:14px;text-decoration:none;white-space:nowrap;transition:color .2s}
.navpill a:not(.btn):hover,.navpill a:not(.btn):focus-visible{color:#fff;animation:whiteglow 1.4s ease-in-out infinite}
.navpill a.on{color:#fff}
.slider{position:absolute;left:0;top:0;bottom:0;border-radius:999px;pointer-events:none;z-index:0;
  background:rgba(84,172,191,.28);border:1px solid rgba(167,235,242,.3);transition:transform .4s cubic-bezier(.2,.8,.2,1),width .4s cubic-bezier(.2,.8,.2,1)}
.navcta{flex:none;padding:9px 18px;font-size:14px}
@keyframes whiteglow{0%,100%{text-shadow:0 0 6px rgba(255,255,255,.55),0 0 14px rgba(255,255,255,.25)}50%{text-shadow:0 0 10px rgba(255,255,255,.95),0 0 24px rgba(255,255,255,.55),0 0 40px rgba(167,235,242,.35)}}
@media(prefers-reduced-motion:reduce){.topnav,.slider{transition:none}.navpill a:hover{animation:none}}

/* the floating bar sits over the top of the page, so give the hero some room */
.hero{padding-top:96px}
@media(max-width:820px){.hero{padding-top:84px}}

```
