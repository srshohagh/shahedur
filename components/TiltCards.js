'use client';
import { Ico } from './Icons';

// Small animated scenes for the three content cards
function Art({ i }) {
  if (i === 0) return (   // videography: viewfinder, REC dot, moving film strip
    <svg viewBox="0 0 240 120" aria-hidden="true">
      <rect x="20" y="12" width="200" height="74" rx="10" fill="rgba(1,28,64,.7)" stroke="#54ACBF" />
      {[[26, 18, 1, 1], [214, 18, -1, 1], [26, 80, 1, -1], [214, 80, -1, -1]].map(([x, y, a, b], k) => <path key={k} d={`M${x} ${y + 10 * b}V${y}H${x + 10 * a}`} fill="none" stroke="#A7EBF2" strokeWidth="2" />)}
      <circle className="rec" cx="42" cy="32" r="4.5" fill="#fb7185" /><text x="52" y="36" fontSize="10" fill="#A7EBF2" fontWeight="600">REC</text>
      <path d="M110 40l26 17-26 17z" fill="#A7EBF2" />
      <g className="film">{Array.from({ length: 14 }).map((_, k) => <rect key={k} x={k * 22} y="96" width="14" height="14" rx="3" fill="rgba(167,235,242,.35)" />)}</g>
    </svg>
  );
  if (i === 1) return (   // scriptwriting: lines being typed
    <svg viewBox="0 0 240 120" aria-hidden="true">
      <rect x="40" y="10" width="160" height="100" rx="10" fill="rgba(1,28,64,.7)" stroke="#54ACBF" />
      {[28, 44, 60, 76].map((y, k) => <rect key={k} className="typeln" style={{ animationDelay: `${k * 0.35}s`, width: [110, 124, 84, 100][k] }} x="56" y={y} height="7" rx="3.5" fill={k === 0 ? '#A7EBF2' : '#54ACBF'} />)}
      <rect className="caret" x="160" y="76" width="3" height="11" fill="#A7EBF2" />
      <path d="M176 92l14-14 6 6-14 14-8 2z" fill="#54ACBF" />
    </svg>
  );
  return (                // content management: calendar with a hopping highlight
    <svg viewBox="0 0 240 120" aria-hidden="true">
      <rect x="30" y="10" width="180" height="100" rx="10" fill="rgba(1,28,64,.7)" stroke="#54ACBF" />
      <rect x="30" y="10" width="180" height="22" rx="10" fill="rgba(84,172,191,.22)" />
      {Array.from({ length: 15 }).map((_, k) => <rect key={k} className={`cell c${k % 5}`} x={44 + (k % 5) * 34} y={42 + Math.floor(k / 5) * 22} width="26" height="16" rx="5" fill="rgba(167,235,242,.14)" />)}
    </svg>
  );
}

function Tilt({ item, i, cls }) {
  const move = (e) => {
    const el = e.currentTarget, r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(x - 0.5) * 12}deg`); el.style.setProperty('--rx', `${(0.5 - y) * 10}deg`);
    el.style.setProperty('--mx', `${x * 100}%`); el.style.setProperty('--my', `${y * 100}%`);
  };
  const leave = (e) => { const el = e.currentTarget; el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); };
  return (
    <article className={`tilt ${cls}`} onPointerMove={move} onPointerLeave={leave} tabIndex={0}>
      <div className="tilt-art"><Art i={i} /></div>
      <div className="tilt-body">
        <span className="ic"><Ico n={item.i} /></span>
        <h3>{item.t}</h3>
        <p>{item.d}</p>
      </div>
    </article>
  );
}

export default function TiltCards({ items }) {
  const cls = ['ta', 'tb', 'tc'];
  return <div className="tiltrow">{items.map((it, i) => <Tilt key={it.t} item={it} i={i} cls={cls[i % 3]} />)}</div>;
}
