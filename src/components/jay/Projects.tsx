'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  defaultProjects,
  DETAIL_SLUGS,
  Project,
  ProjectPattern,
  projectSlug,
  sizes,
  themes
} from '@/lib/projectMeta';

function PatternBackground({ pattern }: { pattern: ProjectPattern }) {
  if (pattern === 'grid')
    return (
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
    );
  if (pattern === 'dots')
    return (
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:16px_16px]" />
    );
  if (pattern === 'lines')
    return (
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_12px)]" />
    );
  if (pattern === 'noise')
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.1),transparent_40%)]" />
    );
  if (pattern === 'circuit')
    return (
      <>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      </>
    );
  return null;
}

export default function Projects({
  projects = defaultProjects
}: {
  projects?: Project[];
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="projects" ref={ref} className="relative px-6 py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.p
          className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--fg-muted)]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          / 03 - selected works
        </motion.p>

        <div className="mb-16 grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
          <motion.h2
            className="font-display text-6xl leading-[0.9] tracking-tight text-[var(--fg)] lg:col-span-8 lg:text-8xl"
            initial={{ y: 50, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Things I&apos;ve{' '}
            <span className="italic text-[var(--accent)]">built</span>.
          </motion.h2>
          <motion.p
            className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)] lg:col-span-4 lg:text-right"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            ↓ scroll · eight of many
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[minmax(200px,auto)]">
          {projects.map((project, i) => {
            const { gradient, accent } = themes[project.theme] ?? themes.blue;
            const span = sizes[project.size] ?? sizes.medium;
            const slug = projectSlug(project);
            const hasDetail = !project.externalUrl && DETAIL_SLUGS.has(slug);
            return (
            <motion.article
              key={project.id ?? i}
              className={`${span} group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101014] p-6 transition-all duration-500 hover:border-white/30 ${hasDetail || project.externalUrl ? 'cursor-pointer' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.7 }}
            >
              {project.externalUrl ? (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${project.title}`}
                  className="absolute inset-0 z-20"
                />
              ) : hasDetail ? (
                <Link
                  href={`/projects/${slug}`}
                  aria-label={`View ${project.title}`}
                  className="absolute inset-0 z-20"
                />
              ) : null}
              {/* Gradient overlay */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 transition-opacity duration-500 group-hover:opacity-70`}
              />
              <div className="pointer-events-none absolute inset-0">
                <PatternBackground pattern={project.pattern} />
              </div>
              {/* Radial glow */}
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-60"
                style={{ background: accent }}
              />

              <div className="relative z-10 flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/60">
                    {project.kicker}
                  </p>
                  <ArrowUpRight
                    size={18}
                    className="text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                  />
                </div>

                <h3 className="mt-4 font-display text-2xl leading-tight tracking-tight text-white md:text-3xl">
                  {project.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {project.description}
                </p>

                <div className="mt-auto pt-4">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[0.65rem] text-white/70 backdrop-blur"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-wider text-white/40">
                    {project.date}
                  </p>
                </div>
              </div>
            </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
