import { TECH } from './techLogos';

const C1 = '#A7EBF2', C2 = '#54ACBF', C3 = '#26658C', C4 = '#023859', C5 = '#011C40';
const logo = (n) => TECH.find((t) => t.name === n);

// Small illustrated scenes for each service (inline SVG, animated with CSS).
export function ServiceArt({ kind, id }) {
  const g = `g${id}`;
  const defs = (
    <defs>
      <linearGradient id={g} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={C3} /><stop offset="1" stopColor={C2} /></linearGradient>
    </defs>
  );
  let body;
  if (kind === 'chat') body = (
    <>
      <rect x="24" y="26" width="160" height="52" rx="14" fill="rgba(84,172,191,.18)" stroke={C2} />
      <rect x="40" y="42" width="108" height="6" rx="3" fill={C1} opacity=".8" /><rect x="40" y="56" width="70" height="6" rx="3" fill={C2} opacity=".7" />
      <rect x="176" y="92" width="160" height="52" rx="14" fill={`url(#${g})`} />
      <rect x="192" y="108" width="100" height="6" rx="3" fill="#fff" opacity=".9" /><rect x="192" y="122" width="64" height="6" rx="3" fill="#fff" opacity=".6" />
      <rect x="24" y="108" width="132" height="72" rx="12" fill="rgba(1,28,64,.7)" stroke="rgba(167,235,242,.25)" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(38 ${122 + i * 19})`}>
          <circle r="7" cx="7" cy="0" fill="none" stroke={C2} /><path className="ck" style={{ animationDelay: `${i * 0.5}s` }} d="M3.5 0l2.5 2.5 5-5" fill="none" stroke={C1} strokeWidth="2" strokeLinecap="round" />
          <rect x="22" y="-3" width={70 - i * 10} height="6" rx="3" fill={C1} opacity=".55" />
        </g>
      ))}
      <circle className="pulse" cx="310" cy="48" r="14" fill="none" stroke={C1} opacity=".6" /><circle cx="310" cy="48" r="5" fill={C1} />
    </>
  );
  else if (kind === 'window') body = (
    <>
      <rect x="28" y="22" width="304" height="158" rx="12" fill="rgba(1,28,64,.75)" stroke={C2} />
      <rect x="28" y="22" width="304" height="26" rx="12" fill="rgba(84,172,191,.18)" />
      {[0, 1, 2].map((i) => <circle key={i} cx={46 + i * 14} cy="35" r="4" fill={[C1, C2, C3][i]} />)}
      <rect x="44" y="60" width="150" height="46" rx="8" fill={`url(#${g})`} /><rect x="54" y="72" width="92" height="7" rx="3.5" fill="#fff" opacity=".9" /><rect x="54" y="86" width="60" height="6" rx="3" fill="#fff" opacity=".55" />
      {[0, 1, 2].map((i) => <rect key={i} x={44 + i * 52} y="118" width="46" height="50" rx="8" fill="rgba(167,235,242,.1)" stroke="rgba(167,235,242,.3)" />)}
      <rect x="210" y="60" width="106" height="108" rx="10" fill="rgba(2,56,89,.7)" stroke="rgba(167,235,242,.25)" />
      <g className="float"><rect x="222" y="74" width="82" height="30" rx="10" fill={C2} opacity=".9" /><rect x="232" y="85" width="50" height="6" rx="3" fill={C5} opacity=".7" /></g>
      <g className="float" style={{ animationDelay: '-1.2s' }}><rect x="232" y="112" width="74" height="30" rx="10" fill={C1} opacity=".25" stroke={C1} /><circle className="pulse" cx="292" cy="150" r="9" fill="none" stroke={C1} /><path d="M292 143l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z" fill={C1} /></g>
    </>
  );
  else if (kind === 'grid') {
    const names = ['WordPress', 'Shopify', 'Wix', 'Squarespace', 'Framer', 'Kajabi'];
    body = (
      <>
        <rect x="24" y="20" width="312" height="162" rx="14" fill="rgba(1,28,64,.6)" stroke="rgba(167,235,242,.25)" />
        {names.map((n, i) => {
          const x = 40 + (i % 3) * 100, y = 36 + Math.floor(i / 3) * 74, t = logo(n);
          return (
            <g key={n} className="float" style={{ animationDelay: `${-i * 0.7}s` }}>
              <rect x={x} y={y} width="88" height="62" rx="14" fill="rgba(2,56,89,.85)" stroke={C2} />
              {t && t.path ? <g transform={`translate(${x + 28} ${y + 14}) scale(1.4)`}><path d={t.path} fill={t.color} /></g> : <text x={x + 44} y={y + 40} textAnchor="middle" fontSize="26" fontWeight="700" fill={C1}>K</text>}
            </g>
          );
        })}
      </>
    );
  } else if (kind === 'phone') body = (
    <>
      <rect x="24" y="24" width="216" height="152" rx="12" fill="rgba(1,28,64,.75)" stroke={C2} />
      {[34, 58, 44, 78, 62].map((h, i) => <rect key={i} className="bar" style={{ animationDelay: `${i * 0.2}s` }} x={44 + i * 36} y={150 - h} width="22" height={h} rx="5" fill={`url(#${g})`} />)}
      <polyline points="44,120 80,100 116,108 152,70 188,82 224,50" fill="none" stroke={C1} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="252" y="30" width="86" height="148" rx="16" fill="rgba(2,56,89,.9)" stroke={C1} /><rect x="282" y="38" width="26" height="5" rx="2.5" fill={C5} />
      <rect x="264" y="56" width="62" height="34" rx="8" fill={`url(#${g})`} />
      {[0, 1, 2].map((i) => <rect key={i} x="264" y={100 + i * 22} width={62 - i * 12} height="10" rx="5" fill={C1} opacity={0.5 - i * 0.1} />)}
    </>
  );
  else if (kind === 'flow') body = (
    <>
      {[['M70 100 C110 100 110 56 150 56', 0], ['M70 100 C110 100 110 144 150 144', 1], ['M196 56 C236 56 236 100 276 100', 2], ['M196 144 C236 144 236 100 276 100', 3]].map(([d, i]) => (
        <path key={i} className="dash" style={{ animationDelay: `${i * 0.25}s` }} d={d} fill="none" stroke={C2} strokeWidth="2.5" />
      ))}
      {[[46, 100, 'bolt'], [173, 56, 'ai'], [173, 144, 'sheet'], [300, 100, 'send']].map(([x, y, k], i) => (
        <g key={k} className="float" style={{ animationDelay: `${-i * 0.6}s` }}>
          <rect x={x - 24} y={y - 24} width="48" height="48" rx="14" fill="rgba(2,56,89,.95)" stroke={k === 'ai' ? C1 : C2} strokeWidth="1.6" />
          {k === 'bolt' && <path d={`M${x + 3} ${y - 12}l-10 14h8l-3 10 11-15h-8z`} fill={C1} />}
          {k === 'ai' && <path d={`M${x} ${y - 13}l3 8 8 3-8 3-3 8-3-8-8-3 8-3z`} fill={C1} />}
          {k === 'sheet' && <><rect x={x - 12} y={y - 11} width="24" height="22" rx="3" fill="none" stroke={C1} /><path d={`M${x - 12} ${y - 3}h24M${x - 12} ${y + 5}h24M${x} ${y - 11}v22`} stroke={C1} /></>}
          {k === 'send' && <path d={`M${x + 11} ${y - 11}L${x - 2} ${y + 2}M${x + 11} ${y - 11}l-5 22-5-9-9-5z`} fill="none" stroke={C1} strokeWidth="1.8" strokeLinejoin="round" />}
        </g>
      ))}
    </>
  );
  else if (kind === 'check') body = (
    <>
      <rect x="30" y="26" width="160" height="148" rx="14" fill="rgba(1,28,64,.75)" stroke={C2} />
      <rect x="30" y="26" width="160" height="30" rx="14" fill="rgba(84,172,191,.2)" /><rect x="46" y="38" width="64" height="7" rx="3.5" fill={C1} />
      {Array.from({ length: 15 }).map((_, i) => <rect key={i} x={44 + (i % 5) * 28} y={70 + Math.floor(i / 5) * 32} width="22" height="22" rx="6" fill={i === 7 ? C2 : 'rgba(167,235,242,.1)'} stroke={i === 7 ? C1 : 'rgba(167,235,242,.22)'} />)}
      <rect x="208" y="36" width="126" height="76" rx="12" fill="rgba(2,56,89,.9)" stroke={C2} />
      <circle cx="248" cy="70" r="14" fill={C3} /><circle cx="248" cy="66" r="5" fill={C1} /><path d="M239 80c2-6 16-6 18 0" fill="none" stroke={C1} strokeWidth="2" />
      <circle cx="296" cy="70" r="14" fill={C2} /><circle cx="296" cy="66" r="5" fill={C5} /><path d="M287 80c2-6 16-6 18 0" fill="none" stroke={C5} strokeWidth="2" />
      <circle className="pulse" cx="271" cy="148" r="22" fill="none" stroke={C1} opacity=".5" /><circle cx="271" cy="148" r="17" fill={`url(#${g})`} /><path className="ck" d="M262 148l6 6 11-12" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </>
  );
  else body = <circle cx="180" cy="100" r="50" fill={`url(#${g})`} />;
  return <svg className="art" viewBox="0 0 360 200" role="img" aria-hidden="true">{defs}{body}</svg>;
}
