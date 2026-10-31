'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Magnetic from '@/components/animations/magnetic';
import Photo from './Photo';

export default function Hero() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/New_York'
      });
      setTime(now);
    };
    update();
    const i = setInterval(update, 30_000);
    return () => clearInterval(i);
  }, []);

  const scrollTo = (href: string) => {
    const target = document.querySelector(href);
    if (!target) return;
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(target as HTMLElement);
    else (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col overflow-hidden px-6 pb-12 pt-28 lg:px-16 lg:pb-20 lg:pt-32"
    >
      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute -left-60 -top-40 h-[700px] w-[700px] rounded-full bg-[var(--accent)] opacity-[0.08] blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-[var(--accent-warm)] opacity-[0.06] blur-[120px]" />

      {/* Top meta row */}
      <motion.div
        className="mb-auto flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
          </span>
          <span>available for research & work</span>
        </div>
        <div className="hidden gap-8 sm:flex">
          <span>new brunswick · nj</span>
          <span suppressHydrationWarning>{time} ET</span>
        </div>
      </motion.div>

      {/* Main composition */}
      <div className="relative grid flex-1 grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Text block */}
        <div className="relative z-10 lg:col-span-8">

          {/* Name */}
          <div className="overflow-hidden pb-[0.12em] pt-[0.05em]">
            <motion.h1
              className="font-display text-[clamp(3.5rem,11vw,10rem)] font-normal leading-[1.0] tracking-[-0.02em] text-[var(--fg)]"
              initial={{ y: 140 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              Hi, I&apos;m
            </motion.h1>
          </div>
          <div className="-ml-[0.1em] overflow-hidden pb-[0.18em] pl-[0.1em] pt-[0.05em]">
            <motion.h1
              className="pl-[0.05em] font-display text-[clamp(4rem,14vw,13rem)] font-normal leading-[1.1] tracking-[-0.03em] text-[var(--fg)]"
              initial={{ y: 160 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Jay
              <span className="italic text-[var(--accent)]"> Raval</span>
              <span className="text-[var(--accent)]">.</span>
            </motion.h1>
          </div>

          {/* Tagline */}
          <motion.p
            className="mt-10 max-w-xl font-display text-xl italic text-[var(--fg-muted)] lg:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
          >
            A CS engineer working on AI, LLM reasoning, and retrieval systems.
          </motion.p>

          {/* Actions */}
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-5 font-mono text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.6 }}
          >
            <Magnetic>
              <button
                onClick={() => scrollTo('#about')}
                className="group flex items-center gap-2 border-b border-[var(--fg)] pb-1 text-[var(--fg)] transition-all hover:gap-3"
              >
                take a walk
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => scrollTo('#research')}
                className="group flex items-center gap-2 border-b border-[var(--fg-soft)] pb-1 text-[var(--fg-muted)] transition-all hover:text-[var(--fg)] hover:border-[var(--fg)]"
              >
                read the papers
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </Magnetic>
          </motion.div>
        </div>

        {/* Photo */}
        <motion.div
          className="relative lg:col-span-4"
          initial={{ opacity: 0, y: 40, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 3 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <div className="relative ml-auto w-full max-w-[340px]">
            <Photo
              className="aspect-[4/5] w-full shadow-2xl"
              rounded="2xl"
              monogramSize="text-7xl"
            />
            {/* caption strip */}
            <div className="absolute -bottom-5 left-4 right-4 flex items-center justify-between rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2 shadow-lg">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                roll 01 · frame 07
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--accent)]">
                2026
              </span>
            </div>
            {/* Tape decorations */}
            <div className="absolute -right-2 -top-2 h-6 w-14 rotate-12 bg-[var(--accent)] opacity-30 blur-[0.5px]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
