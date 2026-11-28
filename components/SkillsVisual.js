import { TECH } from './techLogos';
import { Ico } from './Icons';

const STRENGTHS = [
  ['Lead generation', 'target'], ['Cold outreach', 'send'], ['Business development', 'trend'], ['Proposal writing', 'doc'],
  ['Deal closing', 'check'], ['Team leadership', 'users'], ['Videography', 'camera'], ['Content creation', 'spark'],
];

// Floating brand logos + visual strength tiles (pure CSS animation, no scripts)
export default function SkillsVisual() {
  return (
    <>
      <div className="floatwrap">
        <svg className="orbits" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <ellipse className="o1" cx="400" cy="150" rx="360" ry="110" fill="none" stroke="rgba(167,235,242,.22)" strokeDasharray="4 10" />
          <ellipse className="o2" cx="400" cy="150" rx="250" ry="78" fill="none" stroke="rgba(84,172,191,.28)" strokeDasharray="2 8" />
        </svg>
        <div className="floatfield">
          {TECH.map((t, i) => (
            <div className="fl" key={t.name} style={{ '--d': `${(i % 7) * -0.9}s`, '--s': `${5 + (i % 5) * 0.8}s`, '--c': t.color || '#A7EBF2' }}>
              <span className="tile">
                {t.path ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={t.path} fill="currentColor" /></svg> : <b className="badge">{t.text}</b>}
              </span>
              <em>{t.name}</em>
            </div>
          ))}
        </div>
        <p className="logonote">Logos are trademarks of their respective owners.</p>
      </div>

      <div className="strengths">
        {STRENGTHS.map(([label, icon], i) => (
          <div className="st" key={label} style={{ '--i': i }}>
            <span className="ic lg"><Ico n={icon} /></span>
            <b>{label}</b>
          </div>
        ))}
      </div>
    </>
  );
}
