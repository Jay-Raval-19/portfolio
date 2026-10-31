'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Photo from './Photo';
import dynamic from 'next/dynamic';

const ToolkitCloud = dynamic(() => import('./ToolkitCloud'), { ssr: false });

const skillGroups: Array<{ title: string; items: string[] }> = [
  {
    title: 'languages',
    items: ['Python', 'C++', 'Go', 'TypeScript', 'JavaScript', 'MATLAB']
  },
  {
    title: 'ML & systems',
    items: [
      'Hugging Face',
      'TensorFlow',
      'scikit-learn',
      'LLAMA',
      'React',
      'Node.js',
      'Docker'
    ]
  },
  {
    title: 'data',
    items: ['PostgreSQL', 'Redis', 'Pinecone', 'MongoDB']
  },
  {
    title: 'craft',
    items: ['GSAP', 'Framer Motion', 'Tailwind', 'Figma']
  }
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="about"
      ref={ref}
      className="relative px-6 pb-32 pt-40 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <motion.p
          className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--fg-muted)]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          / 01 - about
        </motion.p>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left: portrait + currently */}
          <div className="lg:col-span-5">
            <motion.div
              className="sticky top-28 space-y-6"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative">
                <Photo
                  src="/images/jay1.jpeg"
                  className="aspect-[4/5] w-full"
                  rounded="3xl"
                  monogramSize="text-8xl"
                />
                {/* film strip metadata */}
                <div className="mt-3 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                  <span>jay raval</span>
                  <span className="h-px flex-1 bg-[var(--border)] mx-3" />
                  <span>BTech CSE · 2026</span>
                </div>
              </div>

              {/* Currently card */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                  </span>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--fg-muted)]">
                    now
                  </p>
                </div>
                <p className="text-[0.95rem] leading-relaxed text-[var(--fg)]">
                  Finished my thesis on LLM reasoning over regular languages.
                  Headed to Rutgers this fall for my MS in Computer Science.
                  Looking for research roles for 2026.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: essay + details */}
          <div className="space-y-14 lg:col-span-7">
            {/* Headline */}
            <motion.h2
              className="font-display text-5xl leading-[0.95] tracking-tight text-[var(--fg)] lg:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              I like{' '}
              <span className="italic text-[var(--accent)]">hard</span>{' '}
              problems - the kind that need equal parts proof and code.
            </motion.h2>

            {/* Bio essay */}
            <motion.div
              className="max-w-2xl space-y-5 text-lg leading-relaxed text-[var(--fg-muted)]"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p>
                I&apos;m a CS graduate from{' '}
                <span className="text-[var(--fg)]">Ahmedabad University</span>,
                headed to{' '}
                <span className="text-[var(--fg)]">Rutgers University</span>{' '}
                this fall for my MS in Computer Science. Most of what I do
                lives at the intersection of{' '}
                <span className="text-[var(--fg)]">formal reasoning</span>,{' '}
                <span className="text-[var(--fg)]">large language models</span>,
                and <span className="text-[var(--fg)]">complex systems</span>.
              </p>
              <p>
                Recently: four papers (one accepted at ACL Findings 2026), a
                summer at an AI startup building India&apos;s first B2B
                chemical sourcing platform, and a handful of side projects
                spanning blockchains, CDNs, and AES internals.
              </p>
              <p>
                I still believe the best way to understand something is to
                break it, rebuild it, and write down what changed.
              </p>
            </motion.div>

            {/* Education & Experience as editorial entries */}
            <motion.div
              className="space-y-10 border-t border-[var(--border)] pt-10"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {[
                {
                  label: 'education',
                  title: 'Rutgers University',
                  sub: 'MS Computer Science · New Brunswick',
                  meta: 'Sep 2026 - May 2028',
                  aside: 'incoming · fall 2026'
                },
                {
                  label: 'education',
                  title: 'Ahmedabad University',
                  sub: 'B.Tech Computer Science & Engineering',
                  meta: 'Aug 2022 - May 2026',
                  aside: 'CGPA 3.5 / 4.0'
                },
                {
                  label: 'experience',
                  title: 'Sourceasy.ai',
                  sub: 'AI Intern - B2B Sourcing Platform',
                  meta: 'May - Jul 2025 · Ahmedabad',
                  aside: 'React · Pinecone · Python'
                },
                {
                  label: 'teaching',
                  title: 'Software Engineering - CSE 408',
                  sub: 'Teaching Assistant · Ahmedabad University',
                  meta: 'Jan - May 2026',
                  aside: 'mentoring 40+ students'
                },
                {
                  label: 'leadership',
                  title: 'ACM Chapter',
                  sub: 'Vice Chair · Ahmedabad University',
                  meta: 'Oct 2024 - Nov 2025',
                  aside: 'workshops & comps'
                }
              ].map((row, i) => (
                <motion.div
                  key={row.title}
                  className="group grid grid-cols-1 gap-2 md:grid-cols-12 md:items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.08, duration: 0.6 }}
                >
                  <div className="md:col-span-2">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--fg-muted)]">
                      {row.label}
                    </p>
                  </div>
                  <div className="md:col-span-6">
                    <p className="font-display text-2xl leading-tight text-[var(--fg)]">
                      {row.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--fg-muted)]">
                      {row.sub}
                    </p>
                  </div>
                  <div className="flex flex-col md:col-span-4 md:items-end">
                    <p className="whitespace-nowrap font-mono text-xs text-[var(--fg-muted)]">
                      {row.meta}
                    </p>
                    <p className="mt-1 whitespace-nowrap font-mono text-xs text-[var(--accent)]">
                      {row.aside}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>

        {/* Toolkit - cloud + list */}
        <motion.div
          className="mt-24 grid grid-cols-1 gap-10 border-t border-[var(--border)] pt-10 lg:grid-cols-12 lg:gap-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="lg:col-span-5">
            <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[var(--fg-muted)]">
              drag me
            </p>
            <ToolkitCloud />
          </div>
          <div className="lg:col-span-7">
            <p className="mb-6 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[var(--fg-muted)]">
              toolkit
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              {skillGroups.map((group, i) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
                >
                  <p className="mb-3 font-display text-lg italic text-[var(--accent)]">
                    {group.title}
                  </p>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
