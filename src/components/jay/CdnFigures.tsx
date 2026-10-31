'use client';

// Custom figures for the Hybrid P2P-CDN project page.
// Palette (CVD-validated on both site surfaces): hybrid/accent #3b82f6,
// baseline #d97706, third stripe #059669.

import { useState } from 'react';
import { motion } from 'framer-motion';

const MONO = 'font-mono text-[0.65rem] uppercase tracking-wider';

/* ------------------------------------------------------------------ */
/* 01 · Segment request fallback waterfall                             */
/* ------------------------------------------------------------------ */

const TIERS = [
  {
    name: 'Local LRU cache',
    latency: 12,
    note: '78% of requests end here',
    detail: 'O(1) hit · 64 × 256 KB segments'
  },
  {
    name: 'P2P mesh',
    latency: 45,
    note: 'BFS path · avg 2.4 hops',
    detail: 'tracker lookup → multi-hop transfer'
  },
  {
    name: 'Edge server',
    latency: 85,
    note: 'regional PostgreSQL store',
    detail: 'stateless fallback tier'
  },
  {
    name: 'Origin (MinIO)',
    latency: 150,
    note: 'last resort - 22% of load',
    detail: 'master copy + FFmpeg HLS pipeline'
  }
];

const MAX_LATENCY = 150;

export function CdnFallbackWaterfall({ accent }: { accent: string }) {
  return (
    <div className="my-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5 sm:p-6">
      <p className={`${MONO} mb-5 text-[var(--fg-muted)]`}>
        request fallback chain · measured latency per tier
      </p>
      <div className="relative">
        {/* connector spine */}
        <div
          className="absolute bottom-5 left-[7px] top-1 w-px"
          style={{ background: 'var(--border)' }}
        />
        {/* travelling request pulse */}
        <motion.div
          className="absolute left-[4px] h-[7px] w-[7px] rounded-full"
          style={{ background: accent }}
          initial={{ top: '2%', opacity: 0 }}
          animate={{ top: ['2%', '92%'], opacity: [0, 1, 1, 0.3] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="space-y-5 pl-6">
          {TIERS.map((tier, i) => (
            <div key={tier.name}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className={`${MONO}`} style={{ color: accent }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium text-[var(--fg)]">
                  {tier.name}
                </span>
                <span className="font-mono text-xs text-[var(--fg-muted)]">
                  {tier.detail}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="h-3 flex-1 max-w-md">
                  <motion.div
                    className="h-full"
                    style={{
                      background: accent,
                      opacity: 1 - i * 0.18,
                      borderRadius: '0 4px 4px 0'
                    }}
                    initial={{ width: 0 }}
                    whileInView={{
                      width: `${(tier.latency / MAX_LATENCY) * 100}%`
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.12 }}
                  />
                </div>
                <span className="w-16 shrink-0 font-mono text-xs text-[var(--fg)]">
                  {i === TIERS.length - 1 ? '~' : ''}
                  {tier.latency} ms
                </span>
              </div>
              <p className="mt-1 font-mono text-[0.65rem] text-[var(--fg-muted)]">
                {tier.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Path-striping cache-fill                                       */
/* ------------------------------------------------------------------ */

// N = 6 segments striped round-robin across L = 3 intermediate peers.
const STRIPE_COLORS = ['#3b82f6', '#059669', '#d97706'];
const HOPS = ['p₀', 'p₁', 'p₂'];
const SEGMENTS = [0, 1, 2, 3, 4, 5];

export function CdnPathStriping() {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5 sm:p-6">
      <p className={`${MONO} mb-5 text-[var(--fg-muted)]`}>
        path-striping on origin fallback · N=6 segments, L=3 hops
      </p>
      <div className="min-w-[540px]">
        {/* the return path */}
        <div className="flex items-center gap-0">
          <PathNode label="edge / origin" wide />
          {HOPS.map((hop, i) => (
            <div key={hop} className="flex flex-1 items-center">
              <Arrow />
              <PathNode label={hop} color={STRIPE_COLORS[i]} />
            </div>
          ))}
          <Arrow />
          <PathNode label="requester p_L" wide emphasis />
        </div>

        {/* cached subsets under each hop */}
        <div className="mt-4 flex items-start gap-0">
          <div className="w-[92px]" />
          {HOPS.map((hop, i) => (
            <div key={hop} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex gap-1.5">
                {SEGMENTS.filter((s) => s % 3 === i).map((s) => (
                  <SegChip key={s} n={s} color={STRIPE_COLORS[i]} />
                ))}
              </div>
              <span className="font-mono text-[0.6rem] text-[var(--fg-muted)]">
                caches ⌈N/L⌉ = 2
              </span>
            </div>
          ))}
          <div className="flex w-[104px] flex-col items-center gap-1.5">
            <div className="grid grid-cols-3 gap-1.5">
              {SEGMENTS.map((s) => (
                <SegChip key={s} n={s} color={STRIPE_COLORS[s % 3]} outline />
              ))}
            </div>
            <span className="font-mono text-[0.6rem] text-[var(--fg-muted)]">
              full batch
            </span>
          </div>
        </div>
      </div>
      <p className="mt-5 border-t border-[var(--border)] pt-3 font-mono text-[0.65rem] leading-relaxed text-[var(--fg-muted)]">
        each intermediate peer caches a disjoint subset → total insertions ≤ 2N
        (12 here) vs (L+1)·N = 24 for naive full replication, with maximal
        segment diversity across the overlay
      </p>
    </div>
  );
}

function PathNode({
  label,
  color,
  wide,
  emphasis
}: {
  label: string;
  color?: string;
  wide?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`flex h-9 shrink-0 items-center justify-center rounded-lg border px-2 font-mono text-[0.65rem] ${
        wide ? 'w-[92px]' : 'w-14'
      } ${emphasis ? 'text-[var(--fg)]' : 'text-[var(--fg-muted)]'}`}
      style={{
        borderColor: color ?? 'var(--border)',
        background: 'var(--bg)'
      }}
    >
      {label}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex flex-1 items-center px-1" aria-hidden>
      <div className="h-px flex-1 bg-[var(--border)]" />
      <span className="text-[0.6rem] text-[var(--fg-muted)]">◂</span>
    </div>
  );
}

function SegChip({
  n,
  color,
  outline
}: {
  n: number;
  color: string;
  outline?: boolean;
}) {
  return (
    <span
      className="inline-flex h-6 w-7 items-center justify-center rounded font-mono text-[0.6rem]"
      style={
        outline
          ? { border: `1.5px solid ${color}`, color: 'var(--fg)' }
          : { background: color, color: '#fff' }
      }
    >
      s{n}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · Traditional vs hybrid comparison                               */
/* ------------------------------------------------------------------ */

const SERIES = {
  traditional: { label: 'Traditional CDN', color: '#d97706' },
  hybrid: { label: 'Hybrid P2P-CDN', color: '#3b82f6' }
} as const;

type Metric = {
  name: string;
  trad: number;
  hyb: number;
  format: (v: number) => string;
  delta: string;
};

const METRICS: Metric[] = [
  {
    name: 'Origin load',
    trad: 100,
    hyb: 22,
    format: (v) => `${v}%`,
    delta: '−78%'
  },
  {
    name: 'Edge load',
    trad: 80,
    hyb: 35,
    format: (v) => `${v}%`,
    delta: '−56%'
  },
  {
    name: 'Avg latency',
    trad: 85,
    hyb: 45,
    format: (v) => `${v} ms`,
    delta: '−47%'
  },
  {
    name: 'Peak capacity',
    trad: 10,
    hyb: 25,
    format: (v) => `${v}k req/s`,
    delta: '2.5×'
  }
];

export function CdnComparisonChart() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="my-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className={`${MONO} text-[var(--fg-muted)]`}>
          traditional cdn vs hybrid · each metric on its own scale
        </p>
        <div className="flex gap-4">
          {Object.values(SERIES).map((s) => (
            <span
              key={s.label}
              className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] text-[var(--fg-muted)]"
            >
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: s.color }}
              />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {METRICS.map((m) => {
          const max = Math.max(m.trad, m.hyb);
          const dim = hovered !== null && hovered !== m.name;
          return (
            <div
              key={m.name}
              className="transition-opacity duration-150"
              style={{ opacity: dim ? 0.45 : 1 }}
              onMouseEnter={() => setHovered(m.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-[var(--fg)]">{m.name}</span>
                <span className="font-mono text-xs font-semibold text-[var(--fg)]">
                  {m.delta}
                </span>
              </div>
              <div className="mt-1.5 space-y-0.5">
                <Bar
                  value={m.trad}
                  max={max}
                  color={SERIES.traditional.color}
                  label={m.format(m.trad)}
                  title={`${SERIES.traditional.label}: ${m.format(m.trad)}`}
                />
                <Bar
                  value={m.hyb}
                  max={max}
                  color={SERIES.hybrid.color}
                  label={m.format(m.hyb)}
                  title={`${SERIES.hybrid.label}: ${m.format(m.hyb)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Bar({
  value,
  max,
  color,
  label,
  title
}: {
  value: number;
  max: number;
  color: string;
  label: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3" title={title}>
      <div className="h-3 flex-1 max-w-md">
        <motion.div
          className="h-full"
          style={{ background: color, borderRadius: '0 4px 4px 0' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        />
      </div>
      <span className="w-20 shrink-0 font-mono text-xs text-[var(--fg-muted)]">
        {label}
      </span>
    </div>
  );
}
