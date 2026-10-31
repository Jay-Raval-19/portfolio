'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Magnetic from '@/components/animations/magnetic';
import ThemeToggle from '@/components/jay/ThemeToggle';
import { TERMINAL_EVENT } from '@/components/jay/Terminal';

function TerminalButton() {
  return (
    <Magnetic>
      <button
        onClick={() => window.dispatchEvent(new Event(TERMINAL_EVENT))}
        aria-label="Open terminal"
        title="terminal (~)"
        className="rounded-md border border-[var(--border)] px-2 py-1.5 font-mono text-[0.7rem] tracking-tight text-[var(--fg-muted)] transition-colors hover:border-[var(--fg-soft)] hover:text-[var(--accent)]"
      >
        {'>_'}
      </button>
    </Magnetic>
  );
}

const navLinks = [
  { label: 'about', href: '#about' },
  { label: 'research', href: '#research' },
  { label: 'projects', href: '#projects' },
  { label: 'contact', href: '#contact' }
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (pathname?.startsWith('/gallery')) return null;

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(target as HTMLElement);
    else (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 z-40 w-full px-6 py-4 transition-all duration-300 lg:px-16 ${
          scrolled
            ? 'border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl'
            : ''
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Magnetic>
            <Link
              href="/"
              className="group flex items-center gap-2 font-display text-xl tracking-tight text-[var(--fg)]"
            >
              <span className="inline-block italic">jay</span>
              <span className="inline-block h-1 w-1 rounded-full bg-[var(--accent)]" />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--fg-muted)] transition-colors group-hover:text-[var(--fg)]">
                raval
              </span>
            </Link>
          </Magnetic>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ label, href }, i) => (
              <Magnetic key={label}>
                <a
                  href={href}
                  onClick={(e) => go(e, href)}
                  className="relative px-3 py-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
                >
                  <span className="mr-2 text-[var(--accent)]">
                    0{i + 1}.
                  </span>
                  {label}
                </a>
              </Magnetic>
            ))}
            <div className="ml-3 flex items-center gap-2">
              <TerminalButton />
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile */}
          <div className="flex items-center gap-3 md:hidden">
            <TerminalButton />
            <ThemeToggle />
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-px w-5 bg-[var(--fg)] transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`block h-px w-5 bg-[var(--fg)] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block h-px w-5 bg-[var(--fg)] transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {menuOpen && (
        <motion.div
          className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-[var(--bg)]/95 backdrop-blur-xl md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <nav className="flex flex-col items-center gap-8">
            {navLinks.map(({ label, href }, i) => (
              <a
                key={label}
                href={href}
                onClick={(e) => go(e, href)}
                className="font-display text-5xl italic text-[var(--fg)]"
              >
                <span className="mr-3 font-mono text-sm not-italic text-[var(--accent)]">
                  0{i + 1}
                </span>
                {label}
              </a>
            ))}
          </nav>
        </motion.div>
      )}
    </>
  );
}
