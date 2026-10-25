// FILE PATH: components/entry/BootSequence.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const entityRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const hudFrameRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const [bootDone, setBootDone] = useState(false);

  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Check if already booted in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('technova_booted') === 'true') {
      setBootDone(true);
      onCompleteRef.current();
      return;
    }

    const context = gsap.context(() => {
      const eyes = [leftEyeRef.current, rightEyeRef.current];

      if (
        !containerRef.current ||
        !entityRef.current ||
        !hudFrameRef.current ||
        !textRef.current ||
        eyes.some((eye) => !eye)
      ) {
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('technova_booted', 'true');
          }
          setBootDone(true);
          onCompleteRef.current();
        },
      });

      gsap.set(eyes, { scaleY: 0, opacity: 0 });
      gsap.set(entityRef.current, { y: -145 });
      gsap.set(hudFrameRef.current, { opacity: 0, scale: 1.35 });
      gsap.set(textRef.current, { opacity: 0, y: 24 });

      tl.to(eyes, {
        scaleY: 1,
        opacity: 1,
        duration: 0.18,
        ease: 'power4.out',
      })
        .to(
          textRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
          },
          '-=0.1'
        )
        .to(eyes, {
          scaleY: 0.05,
          duration: 0.06,
          ease: 'power2.inOut',
          delay: 0.12,
        })
        .to(eyes, {
          scaleY: 1,
          duration: 0.08,
          ease: 'power2.out',
        })
        .to(
          hudFrameRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.25,
            ease: 'expo.out',
          },
          '+=0.05'
        )
        .to(
          textRef.current,
          {
            opacity: 0,
            y: -20,
            duration: 0.35,
          },
          '+=1.8'
        )
        .to(
          entityRef.current,
          {
            scale: 0.38,
            x: () => window.innerWidth / 2 - 58,
            y: () => window.innerHeight / 2 - 58,
            duration: 0.65,
            ease: 'expo.inOut',
          },
          '+=0.05'
        )
        .to(
          containerRef.current,
          {
            backgroundColor: 'rgba(3,3,3,0)',
            duration: 0.45,
            ease: 'power2.out',
          },
          '-=0.45'
        );
    }, containerRef);

    return () => context.revert();
  }, []);

  if (bootDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9000] flex flex-col items-center justify-center bg-[#030303] pointer-events-none"
    >
      {/* Core Entity (Eyes + Architectural Robotic Head Wireframe) */}
      <div
        ref={entityRef}
        className="relative z-20 flex flex-col items-center justify-center"
      >
        {/* Outer Robotic Wireframe Geometry */}
        <div
          ref={hudFrameRef}
          className="relative w-36 h-36 border border-red-500/50 bg-[#070707]/90 flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.25)] hud-clip"
        >
          {/* Architectural Wireframe Lines */}
          <div className="absolute inset-2 border border-white/10 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-red-500" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.25em] text-red-500/70">
            NV-UNIT.01
          </div>

          {/* The Two Glowing Cybernetic Eyes */}
          <div className="flex items-center space-x-6">
            <div
              ref={leftEyeRef}
              className="w-8 h-2 bg-red-500 shadow-[0_0_22px_#ef4444,0_0_8px_#ffffff] skew-x-[-14deg]"
            />
            <div
              ref={rightEyeRef}
              className="w-8 h-2 bg-red-500 shadow-[0_0_22px_#ef4444,0_0_8px_#ffffff] skew-x-[14deg]"
            />
          </div>
        </div>
      </div>

      {/* Welcome Sequence Telemetry Text */}
      <div
        ref={textRef}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center px-5 text-center"
      >
        <p className="font-mono text-xs font-bold tracking-[0.55em] text-red-500 uppercase sm:text-sm">
          SYSTEM ONLINE // INITIALIZING
        </p>
        <p className="mt-4 text-5xl font-black leading-[0.9] tracking-tighter text-white uppercase sm:text-7xl lg:text-8xl xl:text-9xl">
          WELCOME TO
          <span className="mt-2 block bg-gradient-to-r from-white via-red-200 to-red-500 bg-clip-text text-transparent">
            TECHNOVA STUDIO
          </span>
        </p>
      </div>
    </div>
  );
}