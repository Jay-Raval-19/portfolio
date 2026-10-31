'use client';
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Mail, Linkedin, Code2, ArrowUp } from 'lucide-react';
import Magnetic from '@/components/animations/magnetic';
import Link from 'next/link';

const links = [
  { href: 'mailto:jay.mrugesh.raval@gmail.com', label: 'email', icon: Mail },
  {
    href: 'https://linkedin.com/in/jay-raval007',
    label: 'linkedin',
    icon: Linkedin
  },
  {
    href: 'https://leetcode.com/u/JayCodingNinja',
    label: 'leetcode',
    icon: Code2
  }
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/New_York'
      });
      setTime(t);
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden border-t border-[var(--border)] px-6 pb-10 pt-32 lg:px-16 lg:pt-40"
    >
      {/* Background radial */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-[0.07] blur-[130px]" />

      <div className="mx-auto max-w-7xl">
        <motion.p
          className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--fg-muted)]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          / 04 - elsewhere
        </motion.p>

        {/* Giant type */}
        <div className="overflow-hidden">
          <motion.h2
            className="font-display text-[clamp(4rem,15vw,14rem)] font-normal leading-[0.85] tracking-[-0.03em] text-[var(--fg)]"
            initial={{ y: 180 }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Let&apos;s
          </motion.h2>
        </div>
        <div className="overflow-hidden pb-[0.35em] mb-[-0.25em]">
          <motion.h2
            className="font-display text-[clamp(4rem,15vw,14rem)] font-normal leading-[0.85] tracking-[-0.03em]"
            initial={{ y: 180 }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="italic text-[var(--accent)]">build</span>
            <span className="text-[var(--fg)]"> something.</span>
          </motion.h2>
        </div>

        {/* Huge email link */}
        <motion.div
          className="mt-12 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="mailto:jay.mrugesh.raval@gmail.com"
            className="group inline-flex max-w-full flex-wrap items-center gap-3 border-b border-[var(--fg-soft)] pb-3 transition-all hover:border-[var(--fg)]"
          >
            <span className="font-display text-2xl italic text-[var(--fg-muted)] transition-colors group-hover:text-[var(--fg)] md:text-4xl">
              jay.mrugesh.raval@gmail.com
            </span>
            <span className="text-2xl text-[var(--fg-muted)] transition-all group-hover:translate-x-2 group-hover:text-[var(--fg)] md:text-4xl">
              →
            </span>
          </Link>
        </motion.div>

        {/* Secondary links */}
        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          {links.map(({ href, label, icon: Icon }) => (
            <Magnetic key={label}>
              <Link
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-[var(--fg-muted)] transition-all hover:border-[var(--fg-soft)] hover:text-[var(--fg)]"
              >
                <Icon size={14} />
                {label}
              </Link>
            </Magnetic>
          ))}
        </motion.div>

        {/* Coordinates block */}
        <motion.div
          className="mt-24 grid grid-cols-2 gap-8 border-t border-[var(--border)] pt-10 md:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          {[
            { label: 'location', value: 'New Brunswick, NJ' },
            { label: 'coordinates', value: '40.49° N, 74.45° W' },
            {
              label: 'local time',
              value: time || '- : -',
              live: true
            },
            { label: 'version', value: '2026.v1' }
          ].map((row) => (
            <div key={row.label}>
              <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--fg-muted)]">
                {row.label}
              </p>
              <p
                className="font-mono text-sm text-[var(--fg)]"
                suppressHydrationWarning
              >
                {row.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-20 flex flex-col items-start justify-between gap-4 pt-8 sm:flex-row sm:items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          <p className="font-mono text-xs text-[var(--fg-muted)]">
            © 2026 Jay Raval ·
            <span className="ml-3 hidden text-[var(--fg-soft)] sm:inline">
               psst press <kbd className="rounded border border-[var(--border)] px-1">~</kbd>
            </span>
          </p>
          <button
            onClick={() => {
              const lenis = (window as any).__lenis;
              if (lenis) lenis.scrollTo(0);
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
          >
            back to top
            <ArrowUp
              size={14}
              className="transition-transform group-hover:-translate-y-0.5"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
