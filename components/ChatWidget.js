'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { WaIcon, MailIcon, Ico } from './Icons';
import { chat } from '../app/chatConfig';
import { services, skills, jobs, stats, education, languages } from '../app/data';

/* ---------- animated particle orb (the "AI logo") ---------- */
function Orb({ size = 56, speed = 1 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = c.height = size * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const N = 150;
    const pts = Array.from({ length: N }, (_, i) => { const y = 1 - (i / (N - 1)) * 2; return { y, r: Math.sqrt(1 - y * y), th: i * 2.399963, hi: i % 7 === 0 }; });
    let raf; const t0 = performance.now();
    const draw = (now) => {
      const t = ((now - t0) / 1000) * speed, R = size * 0.4, cx = size / 2, tilt = 0.5, ct = Math.cos(tilt), st = Math.sin(tilt);
      ctx.clearRect(0, 0, size, size);
      for (const p of pts) {
        const w = 1 + 0.1 * Math.sin(3 * Math.asin(p.y) + t * 1.6) * Math.cos(2 * p.th - t * 1.1);   // swirling surface
        const a = p.th + t * 0.7, x = Math.cos(a) * p.r * w, z = Math.sin(a) * p.r * w, y = p.y * w;
        const y2 = y * ct - z * st, z2 = y * st + z * ct, d = (z2 + 1) / 2;
        ctx.globalAlpha = 0.25 + d * 0.75;
        ctx.fillStyle = p.hi ? '#8fa8ff' : d > 0.55 ? '#A7EBF2' : '#54ACBF';
        ctx.beginPath(); ctx.arc(cx + x * R, cx + y2 * R, 0.6 + d * 1.3, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size, speed]);
  return <canvas ref={ref} style={{ width: size, height: size }} aria-hidden="true" />;
}

/* ---------- built-in knowledge (works with no backend) ---------- */
const L = chat.links;
const WA_URL = (t) => `https://wa.me/${chat.whatsapp}?text=${encodeURIComponent(t)}`;
const MAIL_URL = (sub, t) => `mailto:${chat.email}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(t)}`;
const CHIPS = ['What services do you offer?', 'Show results', 'Book a meeting', 'Contact details'];
const REACH = [
  { label: 'WhatsApp', href: WA_URL('Hi Shohagh, I found your portfolio and would like to talk.'), kind: 'wa' },
  { label: 'Email', href: MAIL_URL('Portfolio inquiry', 'Hi Shohagh,'), kind: 'mail' },
];

const svcList = services.slice(1, 5).map((s) => `• ${s.t}${s.tag ? ` (${s.tag.replace(/ · /g, ', ')})` : ''}`).join('\n');
const money = (s) => `${s.prefix}${s.v.toLocaleString('en-US')} ${s.l}`;

function intentOf(q) {
  const s = q.toLowerCase(), has = (...w) => w.some((x) => s.includes(x));
  if (has('meeting', 'schedule', 'appointment', 'book', 'call me', 'zoom', 'talk to', 'speak')) return 'meeting';
  if (has('contact', 'whatsapp', 'phone', 'number', 'email', 'linkedin', 'github', 'youtube', 'resume', 'cv', 'reach')) return 'contact';
  if (has('price', 'pricing', 'cost', 'quote', 'budget', 'rate', 'how much')) return 'pricing';
  if (has('service', 'offer', 'website', 'web app', 'saas', 'cms', 'wordpress', 'shopify', 'wix', 'automation', 'n8n', 'build', 'develop', 'app')) return 'services';
  if (has('skill', 'tool', 'expert', 'good at', 'know')) return 'skills';
  if (has('experience', 'work history', 'worked', 'career', 'job', 'background')) return 'experience';
  if (has('result', 'sales', 'revenue', 'orders', 'fiverr', 'achievement', 'success')) return 'results';
  if (has('education', 'study', 'degree', 'university', 'college', 'school')) return 'education';
  if (has('language', 'english', 'bangla', 'hindi')) return 'languages';
  if (has('who', 'about', 'introduce', 'yourself', 'shohagh', 'shahedur')) return 'about';
  if (has('where', 'location', 'timezone', 'time zone', 'dhaka', 'bangladesh')) return 'where';
  if (has('thank', 'thanks', 'great', 'awesome')) return 'thanks';
  if (/^(hi|hello|hey|salam|assalam)/.test(s)) return 'hello';
  return 'fallback';
}

function answer(intent) {
  switch (intent) {
    case 'hello': return { text: 'Hello! I can tell you about Shohagh\u2019s services, skills, experience and results, or help you request a meeting. What would you like to know?', chips: CHIPS };
    case 'about': return { text: 'Md. Shahedur Rahman (Shohagh) is an international sales professional based in Dhaka, Bangladesh. His core skills are client communication, requirement scoping, proposal writing and deal closing, supported by n8n automation and video content production.', chips: ['What services do you offer?', 'Show results', 'Book a meeting'] };
    case 'services': return { text: `Shohagh scopes, prices and manages:\n${svcList}\n\nEvery project starts with a short requirements discussion, then a clear scope, timeline and price.`, chips: ['Pricing', 'Book a meeting', 'Show results'] };
    case 'pricing': return { text: 'Pricing depends on the scope: features, platform and timeline. Share your requirements and Shohagh will send a clear proposal with scope, deliverables, timeline and price.', chips: ['Book a meeting'], actions: REACH };
    case 'skills': return { text: `Core skills: ${skills.map(([l]) => l).join(', ')}.`, chips: ['Show experience', 'What services do you offer?'] };
    case 'experience': return { text: `Experience (newest first):\n${jobs.map((j) => `• ${j.t.replace(': ', ' at ')} (${j.m.split(' \u00b7 ')[0]})`).join('\n')}`, chips: ['Show results', 'Education'] };
    case 'results': return { text: `Results from Shohagh\u2019s Fiverr sales dashboard:\n${stats.map((s) => `• ${money(s)}`).join('\n')}`, chips: ['What services do you offer?', 'Book a meeting'] };
    case 'education': return { text: `Education:\n${education.map((e) => `• ${e.t}, ${e.d} (${e.y})`).join('\n')}`, chips: ['Show experience', 'Languages'] };
    case 'languages': return { text: `Languages: ${languages.join('; ')}.`, chips: ['Show experience'] };
    case 'where': return { text: 'Shohagh is based in Dhaka, Bangladesh (GMT+6) and works with clients around the world.', chips: ['Book a meeting'] };
    case 'contact': return { text: `You can reach Shohagh directly:\n\u2022 WhatsApp / phone: ${chat.phoneDisplay}\n\u2022 Email: ${chat.email}`, actions: [...REACH, { label: 'LinkedIn', href: L.linkedin, kind: 'link' }, { label: 'GitHub', href: L.github, kind: 'link' }, { label: 'YouTube', href: L.youtube, kind: 'link' }, { label: 'Resume', href: L.resume, kind: 'link' }] };
    case 'thanks': return { text: 'You\u2019re welcome! Anything else you\u2019d like to know?', chips: CHIPS };
    default: return { text: 'I\u2019m not sure about that one yet. I can tell you about Shohagh\u2019s services, skills, experience and results, help you request a meeting, or you can message him directly.', chips: CHIPS, actions: REACH };
  }
}

/* ---------- meeting request flow ---------- */
const STEPS = [
  { key: 'name', ask: 'Happy to help set that up. What\u2019s your name?' },
  { key: 'contact', ask: (d) => `Thanks, ${d.name}. What\u2019s the best email or WhatsApp number to reach you?` },
  { key: 'topic', ask: 'What would you like to discuss?', chips: ['Website or web app', 'CMS website', 'SaaS platform', 'AI automation', 'Something else'] },
  { key: 'time', ask: `When would suit you, and in which timezone? (${chat.timezoneNote})` },
];
const stepAsk = (i, d) => ({ text: typeof STEPS[i].ask === 'function' ? STEPS[i].ask(d) : STEPS[i].ask, chips: STEPS[i].chips });

function meetingSummary(d) {
  const text = `Hi Shohagh, I\u2019d like to schedule a meeting.\n\nName: ${d.name}\nContact: ${d.contact}\nTopic: ${d.topic}\nPreferred time: ${d.time}`;
  const actions = [{ label: 'Send via WhatsApp', href: WA_URL(text), kind: 'wa' }, { label: 'Send via Email', href: MAIL_URL(`Meeting request from ${d.name}`, text), kind: 'mail' }];
  if (chat.bookingUrl) actions.push({ label: 'Open calendar', href: chat.bookingUrl, kind: 'link' });
  return { text: `Thanks! Here\u2019s your request:\n\u2022 Name: ${d.name}\n\u2022 Contact: ${d.contact}\n\u2022 Topic: ${d.topic}\n\u2022 Preferred time: ${d.time}\n\nChoose how to send it. It opens with your message ready, and Shohagh will confirm the time.`, actions };
}

/* ---------- optional AI backend ---------- */
async function askAI(history) {
  const first = history.findIndex((m) => m.role === 'user');          // the AI conversation must start with the visitor
  const msgs = history.slice(Math.max(first, 0)).slice(-10);
  const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch(chat.apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: msgs }), signal: ctrl.signal });
    if (!r.ok) throw new Error('bad status');
    const d = await r.json();
    if (!d.reply) throw new Error('empty');
    return String(d.reply);
  } finally { clearTimeout(timer); }
}

/* ---------- widget ---------- */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [flow, setFlow] = useState(null);                  // { step, data }
  const [msgs, setMsgs] = useState([{ id: 0, from: 'bot', text: 'Hi! I\u2019m Shohagh\u2019s AI assistant. Ask me about his services, skills and results, or request a meeting.', chips: CHIPS }]);
  const idRef = useRef(1), endRef = useRef(null), inputRef = useRef(null);
  const push = useCallback((m) => setMsgs((a) => [...a, { id: idRef.current++, ...m }]), []);

  useEffect(() => { endRef.current && endRef.current.scrollIntoView({ block: 'end' }); }, [msgs, typing, open]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current && inputRef.current.focus(), 250); }, [open]);
  useEffect(() => {   // one friendly nudge per visit
    let seen = false; try { seen = sessionStorage.getItem('aibot-tip'); } catch (e) {}
    if (seen) return;
    const a = setTimeout(() => setTip(true), 4500), b = setTimeout(() => setTip(false), 13000);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  const toggle = () => { setOpen((o) => !o); setTip(false); try { sessionStorage.setItem('aibot-tip', '1'); } catch (e) {} };

  const reply = useCallback(async (r) => { setTyping(true); await new Promise((res) => setTimeout(res, 450 + Math.min(r.text.length * 6, 650))); setTyping(false); push({ from: 'bot', ...r }); }, [push]);

  const send = useCallback(async (raw) => {
    const text = raw.trim();
    if (!text || typing) return;
    setInput('');
    const history = [...msgs.filter((m) => m.text).map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })), { role: 'user', content: text }];
    push({ from: 'user', text });

    if (/^(cancel|stop|never ?mind)$/i.test(text) && flow) { setFlow(null); return reply({ text: 'No problem, I\u2019ve cancelled the meeting request. Anything else I can help with?', chips: CHIPS }); }
    if (flow) {                                             // collecting meeting details
      const data = { ...flow.data, [STEPS[flow.step].key]: text };
      if (flow.step + 1 < STEPS.length) { setFlow({ step: flow.step + 1, data }); return reply(stepAsk(flow.step + 1, data)); }
      setFlow(null); return reply(meetingSummary(data));
    }
    const intent = intentOf(text);
    if (intent === 'meeting') { setFlow({ step: 0, data: {} }); return reply({ ...stepAsk(0, {}), chips: ['Cancel'] }); }
    if (chat.apiUrl) {                                      // real AI agent
      setTyping(true);
      try { const t = await askAI(history); setTyping(false); return push({ from: 'bot', text: t }); }
      catch (e) { setTyping(false); }                       // fall back to built-in answers
    }
    return reply(answer(intent));
  }, [msgs, flow, typing, push, reply]);

  const last = msgs[msgs.length - 1];
  return (
    <>
      <div className="aibot">
        {tip && !open && <button type="button" className="aitip" onClick={toggle}>Hi! Ask me about Shohagh or book a meeting</button>}
        <button type="button" className={`aibtn${open ? ' on' : ''}`} onClick={toggle} aria-label={open ? 'Close AI assistant' : 'Open AI assistant'} aria-expanded={open} aria-controls="aichat">
          <span className="aiglow" aria-hidden="true" />
          {open ? <Ico n="close" /> : <Orb size={58} />}
        </button>
      </div>

      <section id="aichat" className={`aichat${open ? ' open' : ''}`} role="dialog" aria-label={chat.assistantName} aria-hidden={!open} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
        <header className="aihead">
          <span className="aiavatar"><Orb size={38} speed={1.4} /></span>
          <div><b>{chat.assistantName}</b><span><i className="dot" />Online · replies instantly</span></div>
          <button type="button" className="aix" onClick={() => setOpen(false)} aria-label="Close chat"><Ico n="close" /></button>
        </header>

        <div className="aimsgs" aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={`aimsg ${m.from}`}>
              <div className="b">{m.text}</div>
              {m.actions && <div className="aiacts">{m.actions.map((a) => (
                <a key={a.label} className={`act ${a.kind || ''}`} href={a.href} target="_blank" rel="noopener noreferrer">{a.kind === 'wa' && <WaIcon />}{a.kind === 'mail' && <MailIcon />}{a.label}</a>
              ))}</div>}
              {m === last && !typing && m.chips && <div className="aichips">{m.chips.map((c) => <button key={c} type="button" className="aichip" onClick={() => send(c)}>{c}</button>)}</div>}
            </div>
          ))}
          {typing && <div className="aimsg bot"><div className="b typing"><i /><i /><i /></div></div>}
          <div ref={endRef} />
        </div>

        <form className="aiform" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder={flow ? 'Type your answer...' : 'Ask a question...'} aria-label="Your message" maxLength={500} autoComplete="off" />
          <button type="submit" className="aisend" aria-label="Send message" disabled={!input.trim() || typing}><Ico n="send" /></button>
        </form>
        <p className="ainote">Automated assistant. For anything urgent, message on WhatsApp.</p>
      </section>
    </>
  );
}
