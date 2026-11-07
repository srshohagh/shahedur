'use client';
import { useEffect, useRef, useState } from 'react';
import { WaIcon, MailIcon, Ico } from './Icons';

const NUMBER = '8801875601397';
const EMAIL = 'Shahedur6@gmail.com';

// No server needed: the message opens WhatsApp or the visitor's email app, ready to send.
export default function ContactForm() {
  const [via, setVia] = useState('whatsapp');
  const [status, setStatus] = useState('');
  const [sent, setSent] = useState(false);
  const [seen, setSeen] = useState(false);
  const ref = useRef(null);

  // fade the card and its fields in when it scrolls into view
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim();
    const reach = String(f.get('reach') || '').trim();
    const msg = String(f.get('message') || '').trim();
    if (!name || !msg) return setStatus('Please add your name and a message.');
    const text = `Hi Shohagh, this is ${name}.\n\n${msg}${reach ? `\n\nYou can reach me at: ${reach}` : ''}`;
    setSent(true);
    setTimeout(() => setSent(false), 2400);
    if (via === 'whatsapp') {
      window.open(`https://wa.me/${NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      setStatus('Opening WhatsApp with your message ready to send.');
    } else {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Portfolio inquiry from ${name}`)}&body=${encodeURIComponent(text)}`;
      setStatus('Opening your email app with your message ready to send.');
    }
  };

  return (
    <form ref={ref} className={`mailcard${seen ? ' in' : ''}${sent ? ' sent' : ''}`} onSubmit={onSubmit} noValidate>
      <span className="flap" aria-hidden="true" />
      <span className="stamp" aria-hidden="true"><Ico n="mail" /></span>
      <h3>Send a message</h3>
      <p className="hint">Write your message and choose how you would like to send it.</p>

      <div className="field" style={{ '--i': 0 }}>
        <input id="cf-name" name="name" placeholder=" " autoComplete="name" required />
        <label htmlFor="cf-name">Your name</label>
      </div>
      <div className="field" style={{ '--i': 1 }}>
        <input id="cf-reach" name="reach" placeholder=" " autoComplete="email" />
        <label htmlFor="cf-reach">Your email or phone (optional)</label>
      </div>
      <div className="field" style={{ '--i': 2 }}>
        <textarea id="cf-msg" name="message" placeholder=" " required />
        <label htmlFor="cf-msg">Tell me about your project or question</label>
      </div>

      <div className="field" style={{ '--i': 3 }}>
        <span className="vialbl" id="via-label">Send via</span>
        <div className={`via ${via}`} role="radiogroup" aria-labelledby="via-label">
          <span className="thumb" aria-hidden="true" />
          <label><input type="radio" name="via" checked={via === 'whatsapp'} onChange={() => setVia('whatsapp')} /><span className="opt"><WaIcon />WhatsApp</span></label>
          <label><input type="radio" name="via" checked={via === 'email'} onChange={() => setVia('email')} /><span className="opt"><MailIcon />Email</span></label>
        </div>
      </div>

      <div className="field" style={{ '--i': 4 }}>
        <button type="submit" className={`btn send ${via === 'whatsapp' ? 'wa' : 'em'}`}>
          {via === 'whatsapp' ? <WaIcon /> : <MailIcon />}
          <span>Send via {via === 'whatsapp' ? 'WhatsApp' : 'Email'}</span>
          <span className="plane" aria-hidden="true"><Ico n="send" /></span>
        </button>
      </div>
      <p className="status" role="status" aria-live="polite">{status}</p>
      <p className="formnote">This opens WhatsApp or your email app with your message ready to send. Nothing is stored on this website.</p>
    </form>
  );
}
