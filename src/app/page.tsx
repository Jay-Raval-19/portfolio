import Hero from '@/components/jay/Hero';
import About from '@/components/jay/About';
import Research from '@/components/jay/Research';
import Projects from '@/components/jay/Projects';
import Contact from '@/components/jay/Contact';
import GameOfLife from '@/components/jay/GameOfLife';
import GradientField from '@/components/jay/GradientField';
import ContrastCursor from '@/components/animations/cursor/contrastCursor';
import { getProjects } from '@/lib/getProjects';
import Link from 'next/link';

export default async function Home() {
  const projects = await getProjects();
  return (
    <div className="overflow-x-hidden bg-[var(--bg)] text-[var(--fg)]">
      <ContrastCursor isActive={false} />
      <Hero />

      {/* Game of Life strip - homage to the cellular automata paper */}
      <div className="relative border-y border-[var(--border)] bg-[var(--bg-subtle)] py-8">
        <div className="pointer-events-none absolute left-6 top-3 z-10 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--fg-muted)] lg:left-16">
          B3/S23 · conway&apos;s game of life
        </div>
        <GameOfLife rows={14} cellSize={14} stepMs={130} />
      </div>

      <About />

      {/* Latent image - entryway to the darkroom */}
      <div className="relative">
        <div className="pointer-events-none absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[var(--fg-soft)] bg-[var(--bg)]/90 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--fg)] shadow-sm backdrop-blur-md lg:left-16">
          I&apos;m a photographer too · view my gallery
        </div>
        <Link
          href="/gallery"
          className="group absolute right-6 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2 rounded-full border border-[var(--fg-soft)] bg-[var(--bg)]/90 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--fg)] shadow-sm backdrop-blur-md transition-all hover:border-[var(--fg)] hover:bg-[var(--bg)] hover:text-[var(--accent)] lg:right-16"
        >
          <span className="h-1 w-1 rounded-full bg-[var(--accent)] transition-transform group-hover:scale-150" />
          enter the darkroom
          <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
        <GradientField height={180} cellSize={10} />
      </div>

      <Research />
      <Projects projects={projects} />
      <Contact />
    </div>
  );
}
