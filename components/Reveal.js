
"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  className = "",
  direction = "up",
}) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${direction} ${
        visible ? "is-visible" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
