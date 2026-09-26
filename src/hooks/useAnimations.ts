'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useCountUp(
  end: number,
  duration: number = 2000,
  startOnMount: boolean = false
): { value: number; start: () => void; ref: React.RefObject<HTMLElement | null> } {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(startOnMount);
  const ref = useRef<HTMLElement>(null);

  const start = useCallback(() => setStarted(true), []);

  useEffect(() => {
    if (!started) return;

    let startTime: number;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * end));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, started]);

  // Intersection observer for auto-start
  useEffect(() => {
    if (startOnMount || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnMount]);

  return { value, start, ref };
}

export function useInView(threshold: number = 0.2) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}
