import NetworkBackground from '../components/NetworkBackground';
import Photo from '../components/Photo';
import HeroWaves from '../components/HeroWaves';
import GlowEffects from '../components/GlowEffects';
import CountUp from '../components/CountUp';
import Nav from '../components/Nav';
import ContactForm from '../components/ContactForm';
import { WaIcon, MailIcon, InIcon, GhIcon, YtIcon, DocIcon, Ico } from '../components/Icons';
import { stats, jobs, services, strategy, creative, skills, languages, education } from './data';

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
const WA = 'https://wa.me/8801875601397?text=' + encodeURIComponent('Hi Shohagh, I found your portfolio and would like to talk.');

const SH = ({ i, title, sub }) => (
  <>
    <div className="sh"><span className="ic"><Ico n={i} /></span><h2>{title}</h2><i className="ln" /></div>
    {sub && <p className="sub">{sub}</p>}
  </>
);

export default function Home() {
  return (
    <>
      <NetworkBackground />
      <GlowEffects />
      <Nav />

      <header className="top" id="top">
        <HeroWaves />
        <div className="wrap hero">
          <div className="g hero-main">
            <span className="chip">International sales · Automation · Video</span>
            <h1>I close international deals and <em>automate</em> the work behind them.</h1>
            <p>
              I&rsquo;m Md. Shahedur Rahman (Shohagh), an international sales professional. My core skills are client
              communication, requirement scoping, proposal writing and deal closing, supported by n8n automation and
              video content production.
            </p>
            <a className="btn pill" href="#contact">Work with me <span className="arr"><Ico n="arrow" /></span></a>
          </div>
          <div className="g hero-photo">
            <Photo src={`${base}/hero-portrait.webp`} alt="Portrait of Md. Shahedur Rahman" />
          </div>
          <div className="tiles">
            <div className="g tile"><span className="ic"><Ico n="chat" /></span><div><b>Client communication</b><span>Fast replies, clear requirements</span></div></div>
            <div className="g tile"><span className="ic"><Ico n="doc" /></span><div><b>Proposals and closing</b><span>Scope, pricing and timeline</span></div></div>
            <div className="g tile"><span className="ic"><Ico n="flow" /></span><div><b>Automation and video</b><span>n8n workflows, content production</span></div></div>
          </div>
        </div>
      </header>

      <main>
        <section id="about"><div className="wrap">
          <SH i="user" title="About" />
          <div className="aboutgrid">
            <div className="g pad about">
              <p>My work sits where sales, technology and content meet. Day to day, that means international client communication, requirement scoping, proposal writing and deal closing, supported by working knowledge of n8n automation, CRM tools such as Odoo, and video production.</p>
              <p>The strategy is straightforward: understand what the client actually needs, define it clearly, and keep the process fast and organised. Clear requirements make proposals easier to approve and projects easier to deliver, while automation removes repetitive follow-up work.</p>
              <p>Ongoing learning in automation, web technology and cybersecurity fundamentals keeps the skillset current.</p>
              <div className="aboutlinks">
                <a className="btn brand b-in" href="https://www.linkedin.com/in/md-shahedur-rahman98/" target="_blank" rel="noopener noreferrer"><InIcon />LinkedIn</a>
                <a className="btn brand b-gh" href="https://github.com/srshohagh" target="_blank" rel="noopener noreferrer"><GhIcon />GitHub</a>
                <a className="btn brand b-yt" href="https://www.youtube.com/@shahedurrahman4909" target="_blank" rel="noopener noreferrer"><YtIcon />YouTube</a>
                <a className="btn brand b-cv" href={`${base}/resume.pdf`}><DocIcon />Resume (PDF)</a>
              </div>
            </div>
            <div className="g pad strat">
              <h3 className="mini">Strategy</h3>
              <ol>
                {strategy.map((s, i) => (
                  <li key={s.t}><i>{String(i + 1).padStart(2, '0')}</i><div><b>{s.t}</b><span>{s.d}</span></div></li>
                ))}
              </ol>
            </div>
          </div>
        </div></section>

        <section id="results"><div className="wrap">
          <SH i="bars" title="Results so far" sub="Numbers from my Fiverr sales dashboard, April to September 2026." />
          <div className="rgrid">
            {stats.map((s, i) => (
              <div className={`g tone t${[1, 2, 3][i]} rs`} key={s.l}>
                <div className="stat"><b><CountUp to={s.v} prefix={s.prefix} /></b><span>{s.l}</span></div>
              </div>
            ))}
          </div>
        </div></section>

        <section id="experience"><div className="wrap">
          <SH i="briefcase" title="Experience" sub="Sales, marketing, content and customer work, newest first." />
          <div className="grid2">
            {jobs.map((j, i) => (
              <div className={`g tone t${(i % 6) + 1} job`} key={j.t}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{j.t}</h3><div className="meta">{j.m}</div><p>{j.d}</p>
              </div>
            ))}
          </div>
        </div></section>

        <section id="services"><div className="wrap">
          <SH i="grid" title="Services" sub="Platforms and workflows scoped, priced and managed for international clients." />
          <div className="grid3">
            {services.map((s, i) => (
              <div className="g svc" key={s.t}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <span className="ic lg"><Ico n={s.i} /></span>
                <h3>{s.t}</h3>
                {s.tag && <div className="meta">{s.tag}</div>}
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div></section>

        <section id="creative"><div className="wrap">
          <SH i="play" title="Content and video" sub="Video, scripts and content work that started well before sales." />
          <div className="grid3">
            {creative.map((c) => (
              <div className="g svc" key={c.t}>
                <span className="ic lg"><Ico n={c.i} /></span>
                <h3>{c.t}</h3><p>{c.d}</p>
              </div>
            ))}
          </div>
          <p className="note">Creative version of my resume: <a href={`${base}/resume-creative.pdf`}>resume-creative.pdf</a></p>
        </div></section>

        <section id="skills"><div className="wrap">
          <SH i="bolt" title="Skills" sub="Tools and strengths used every day." />
          <div className="skillgrid">
            <div className="g pad"><h3 className="mini">Core skills</h3>
              <div className="tags">{skills.map(([label, c]) => <span key={label} style={{ '--c': c }}>{label}</span>)}</div>
            </div>
            <div className="stack">
              <div className="g pad"><h3 className="mini">Certification</h3><b>OPSWAT Cybersecurity Fundamentals Associate (OCFA)</b><p>OPSWAT Academy, issued October 2026.</p></div>
              <div className="g pad"><h3 className="mini">Languages</h3><div className="tags">{languages.map((l) => <span key={l}>{l}</span>)}</div></div>
            </div>
          </div>
        </div></section>

        <section id="education"><div className="wrap">
          <SH i="cap" title="Education" />
          <div className="grid3">
            {education.map((e) => (
              <div className="g svc" key={e.t}><h3>{e.t}</h3><p>{e.d}<br />{e.y}</p></div>
            ))}
            <div className="g svc wide"><h3>Clubs</h3><p>Organization Secretary, Govt. Bangla College Science Club (2022 to 2023). Member of the Recitation Club and the Bangladesh Science Fiction Society.</p></div>
          </div>
        </div></section>

        <section id="contact" className="contact"><div className="wrap">
          <SH i="mail" title="Contact" sub="Send a message by WhatsApp or email." />
          <div className="contactgrid">
            <div className="contactinfo">
              <h3>Let&rsquo;s work together</h3>
              <p>Have a project or a role in mind? Send a message and expect a prompt reply.</p>
              <p className="phone"><a href="tel:+8801875601397">+880 1875 601397</a><br /><a href="mailto:Shahedur6@gmail.com">Shahedur6@gmail.com</a></p>
              <div className="animslot" data-anim="contact" aria-hidden="true" />
            </div>
            <ContactForm />
          </div>
        </div></section>
      </main>

      <a className="wa-float" href={WA} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><WaIcon /><span>Chat on WhatsApp</span></a>
      <footer>© {new Date().getFullYear()} Md. Shahedur Rahman (Shohagh) · Dhaka, Bangladesh</footer>
    </>
  );
}
