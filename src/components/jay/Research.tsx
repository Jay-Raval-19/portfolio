'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

type Paper = {
  num: string;
  title: string;
  authors: string;
  venue: string;
  status: string;
  statusTone: 'accept' | 'review' | 'revision';
  keywords: string[];
  gradient: string;
  glyph: string;
  description: string;
  image?: string;
};

const papers: Paper[] = [
  {
    num: '§ 01',
    title: 'Testing the Limits of Large Language Models on Regular Languages',
    authors: 'Jay Raval · Shlok Shelat · Souvik Roy · Manas Gaur',
    venue: 'EMNLP 2026',
    status: 'under review',
    statusTone: 'review',
    keywords: ['LLMs', 'Regular Languages', 'DFA', 'Symbolic Reasoning'],
    gradient: 'from-blue-500 via-indigo-500 to-violet-600',
    glyph: '(a|b)*a(a|b)(a|b)',
    image: '/images/papers/paper-01.jpg',
    description:
      'A staged diagnostic framework exposing eleven systematic failure modes in LLM symbolic reasoning on regular languages, across GPT-5.2, Grok-4.1, Gemini-2.5 and Qwen2.5.'
  },
  {
    num: '§ 02',
    title:
      'Beyond Memorization: Testing LLM Reasoning on Unseen Theory of Computation Tasks',
    authors: 'Shlok Shelat · Jay Raval · Souvik Roy · Manas Gaur',
    venue: 'ACL Findings 2026',
    status: 'accepted',
    statusTone: 'accept',
    keywords: ['DFA', 'ToC', 'Generalization', 'Benchmarking'],
    gradient: 'from-violet-500 via-fuchsia-500 to-blue-600',
    glyph: 'q₀ → q₁ → q₂ → qf',
    image: '/images/papers/paper-02.jpg',
    description:
      'DFA construction benchmark showing LLM success on Theory of Computation reflects memorization, not compositional reasoning, 30–64% accuracy drops on unseen problems.'
  },
  {
    num: '§ 03',
    title: 'Is it possible to predict phase transition in cellular automata?',
    authors: 'Jay Raval · Aarya Parekh · Sumit Adak · Souvik Roy',
    venue: 'Chaos, Solitons & Fractals',
    status: 'under review',
    statusTone: 'review',
    keywords: ['Cellular Automata', 'Phase Transition', 'ML', 'Game of Life'],
    gradient: 'from-cyan-500 via-teal-500 to-emerald-600',
    glyph: '◼ ◻ ◼ ◻ ◼ ◻',
    image: '/images/papers/paper-03.jpg',
    description:
      'ML-based pattern classifiers (CatBoost, XGBoost, SVM) predict phase transitions in extended Game-of-Life rules under α, stochastic, and temporal perturbations.'
  },
  {
    num: '§ 04',
    title: 'Understanding the Game of Collaboration through H-Index',
    authors: 'Jinil Savaj · Jay Raval · Amit A. Nanavati · Souvik Roy',
    venue: 'Under Revision',
    status: 'under revision',
    statusTone: 'revision',
    keywords: ['Networks', 'H-Index', 'Scientometrics', 'Graph Models'],
    gradient: 'from-rose-500 via-orange-500 to-amber-500',
    glyph: '◯ ─ ◯ ─ ◯',
    image: '/images/papers/paper-04.jpg',
    description:
      'Generative co-authorship model using h-index as expertise flow. Identifies source/sink dynamics and replicates empirical patterns via h-index preferential attachment.'
  }
];

const toneClass: Record<Paper['statusTone'], string> = {
  accept: 'text-emerald-500 border-emerald-500/30',
  review: 'text-amber-500 border-amber-500/30',
  revision: 'text-orange-500 border-orange-500/30'
};

export default function Research() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="research" ref={ref} className="relative px-6 py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.p
          className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--fg-muted)]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          / 02, research
        </motion.p>

        <div className="mb-20 grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
          <motion.h2
            className="font-display text-6xl leading-[0.9] tracking-tight text-[var(--fg)] lg:col-span-7 lg:text-8xl"
            initial={{ y: 50, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Writing &<br />
            <span className="italic text-[var(--accent)]">thinking</span>.
          </motion.h2>
        </div>

        {/* Editorial paper list */}
        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {papers.map((paper, i) => (
            <motion.article
              key={i}
              className="group relative cursor-pointer overflow-hidden"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.7 }}
            >
              {/* Hover gradient strip */}
              <motion.div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${paper.gradient}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: hovered === i ? 0.08 : 0 }}
                transition={{ duration: 0.4 }}
              />

              <div className="relative grid grid-cols-1 items-start gap-8 px-2 py-10 lg:grid-cols-12 lg:gap-10">
                {/* Number + framed thumbnail */}
                <div className="flex items-start gap-4 lg:col-span-2 lg:items-center lg:self-center">
                  <div className="relative shrink-0">
                    {/* Soft gradient glow ring on hover */}
                    <motion.div
                      className={`pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-br ${paper.gradient} blur-md`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hovered === i ? 0.35 : 0 }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.div
                      className="relative h-28 w-28 overflow-hidden rounded-xl border border-[var(--border)] bg-black ring-1 ring-inset ring-white/5"
                      animate={{ scale: hovered === i ? 1.04 : 1 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {paper.image ? (
                        <Image
                          src={paper.image}
                          alt={paper.title}
                          fill
                          className="object-cover"
                          sizes="112px"
                          quality={100}
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${paper.gradient}`}>
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:8px_8px]" />
                          <div className="absolute inset-0 flex items-center justify-center p-2 font-mono text-[0.6rem] uppercase tracking-wider text-white/90">
                            {paper.glyph}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)] lg:hidden">
                    {paper.num}
                  </span>
                </div>

                {/* Title + authors */}
                <div className="lg:col-span-7">
                  <p className="mb-3 hidden font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--fg-muted)] lg:block">
                    {paper.num}
                  </p>
                  <h3 className="font-display text-2xl leading-tight tracking-tight text-[var(--fg)] transition-colors lg:text-3xl">
                    {paper.title}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--fg-muted)]">
                    {paper.authors}
                  </p>
                  <motion.p
                    className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--fg-muted)]"
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: hovered === i ? 1 : 0.6 }}
                  >
                    {paper.description}
                  </motion.p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {paper.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-full border border-[var(--border)] px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--fg-muted)]"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status + venue */}
                <div className="relative z-20 flex flex-col gap-3 lg:col-span-3 lg:items-end">
                  <span
                    className={`rounded-full border bg-[var(--bg-subtle)] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] ${toneClass[paper.statusTone]}`}
                  >
                    {paper.status}
                  </span>
                  <p className="font-mono text-xs text-[var(--fg-muted)]">
                    {paper.venue}
                  </p>
                  <ArrowUpRight
                    size={20}
                    className="text-[var(--fg-soft)] transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--fg)]"
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
