'use client';
import { useState } from 'react';

export default function Photo({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="portrait-fallback">SR</div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="portrait" src={src} alt={alt} width="860" onError={() => setFailed(true)} />;
}
