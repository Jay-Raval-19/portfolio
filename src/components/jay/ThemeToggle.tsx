'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { AnimatePresence, motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--fg-muted)] transition-all hover:text-[var(--fg)] hover:border-[var(--fg-soft)]"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
          transition={{ duration: 0.25 }}
          className="absolute"
        >
          {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
