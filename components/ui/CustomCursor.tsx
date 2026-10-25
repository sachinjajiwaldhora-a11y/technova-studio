// FILE PATH: components/ui/CustomCursor.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const auraRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      if (auraRef.current) {
        gsap.to(auraRef.current, {
          x: clientX,
          y: clientY,
          duration: 0.35,
          ease: 'power2.out',
        });
      }

      if (dotRef.current) {
        gsap.to(dotRef.current, {
          x: clientX,
          y: clientY,
          duration: 0.05,
          ease: 'power2.out',
        });
      }

    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <div
        ref={auraRef}
        aria-hidden="true"
        className="fixed left-0 top-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
        style={{
          background:
            'radial-gradient(circle, rgba(220, 38, 38, 0.22) 0%, rgba(127, 29, 29, 0.12) 42%, rgba(3, 3, 3, 0) 72%)',
        }}
      />

      {/* Center Precision Crimson Point */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"
      />

    </div>
  );
}