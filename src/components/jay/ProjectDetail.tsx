'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import ContrastCursor from '@/components/animations/cursor/contrastCursor';
import { themes } from '@/lib/projectMeta';
import type { ProjectDetail } from '@/lib/projectDetails';
import {
  CdnFallbackWaterfall,
  CdnPathStriping,
  CdnComparisonChart
} from '@/components/jay/CdnFigures';
import { NeuronExplorer } from '@/components/jay/NeuronFigures';

const ease = [0.16, 1, 0.3, 1] as const;

const FIGURES: Record<
  string,
  (props: { accent: string }) => React.JSX.Element
> = {
  'cdn-fallback': ({ accent }) => <CdnFallbackWaterfall accent={accent} />,
  'cdn-striping': () => <CdnPathStriping />,
  'cdn-comparison': () => <CdnComparisonChart />,
  'neuron-explorer': ({ accent }) => <NeuronExplorer accent={accent} />
};

export default function ProjectDetail({ project }: { project: ProjectDetail }) {
  const { gradient, accent } = themes[project.theme] ?? themes.blue;

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <ContrastCursor isActive={false} />
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-[var(--border)] px-6 pb-16 pt-28 lg:px-16 lg:pt-36">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`}
        />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-[120px]"
          style={{ background: accent }}
        />

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <Link
              href="/#projects"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              all projects
            </Link>
          </motion.div>

          <motion.p
            className="mt-10 font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: accent }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {project.role} · {project.date}
          </motion.p>

          <motion.h1
            className="mt-5 font-display text-5xl leading-[0.95] tracking-tight text-[var(--fg)] lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease }}
          >
            {project.title}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--fg-muted)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
          >
            {project.tagline}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--fg-muted)]"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16 lg:px-16">
        {/* Stat tiles */}
        {project.stats && project.stats.length > 0 && (
          <motion.div
            className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
          >
            {project.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5"
              >
                <p
                  className="font-display text-3xl tracking-tight lg:text-4xl"
                  style={{ color: accent }}
                >
                  {stat.value}
                </p>
                <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--fg-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Overview */}
        <motion.p
          className="mb-20 max-w-3xl text-xl leading-relaxed text-[var(--fg)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          {project.overview}
        </motion.p>

        {/* Sections */}
        <div className="space-y-16">
          {project.sections.map((section, i) => (
            <motion.section
              key={section.heading}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
            >
              <div className="lg:col-span-4">
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-mono text-xs"
                    style={{ color: accent }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-display text-3xl leading-tight tracking-tight text-[var(--fg)]">
                    {section.heading}
                  </h2>
                </div>
              </div>
              <div className="lg:col-span-8">
                {section.body &&
                  section.body.split('\n\n').map((para, j) => (
                    <p
                      key={j}
                      className="mb-4 text-base leading-relaxed text-[var(--fg-muted)]"
                    >
                      {para}
                    </p>
                  ))}
                {section.figure &&
                  FIGURES[section.figure] &&
                  FIGURES[section.figure]({ accent })}
                {section.images && section.images.length > 0 && (
                  <div className="my-6 space-y-6">
                    {section.images.map((img) => (
                      <figure key={img.src}>
                        <div
                          className={`overflow-hidden rounded-2xl border border-[var(--border)] ${
                            img.plate ? 'bg-white p-3 sm:p-4' : 'bg-[var(--bg-subtle)]'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.src}
                            alt={img.alt}
                            loading="lazy"
                            className="h-auto w-full rounded-lg"
                          />
                        </div>
                        {img.caption && (
                          <figcaption className="mt-2 font-mono text-[0.65rem] leading-relaxed text-[var(--fg-muted)]">
                            {img.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                )}
                {section.code && (
                  <pre className="my-6 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5 font-mono text-[0.8rem] leading-relaxed text-[var(--fg-muted)]">
                    <code>{section.code}</code>
                  </pre>
                )}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {section.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-3 text-base leading-relaxed text-[var(--fg-muted)]"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: accent }}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Reference links */}
        {project.links && project.links.length > 0 && (
          <motion.div
            className="mt-20 border-t border-[var(--border)] pt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-[var(--fg-muted)]">
              references
            </p>
            <div className="flex flex-wrap gap-3">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-2 font-mono text-xs text-[var(--fg-muted)] transition-colors hover:border-[var(--fg-soft)] hover:text-[var(--fg)]"
                >
                  {link.label}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to projects */}
        <div className="mt-20">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            back to all projects
          </Link>
        </div>
      </main>
    </div>
  );
}
