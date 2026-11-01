'use client';

// Interactive neuron census for the spectral-index project page.
// Every number here is measured over 260,978 valid patches of 1,428 HLS tiles, by
// scripts/characterize_units.py in the research repo. Curves are that script's tuning.csv
// verbatim: mean activation per quantile bin of the index the unit tracks best.

import { useState } from 'react';
import { motion } from 'framer-motion';

const MONO = 'font-mono text-[0.65rem] uppercase tracking-wider';
const IMG = '/images/projects/spectral-index-eo/neurons';

type Unit = {
  id: string;
  variant: string;
  label: string;
  /** Index whose value explains the most activation variance, and the band pair behind it. */
  index: string;
  pair: string;
  /** Share of activation variance that index explains, any response shape. */
  eta2: number;
  /** Monotone rank correlation with the same index, and with overall brightness. */
  rho: number;
  brightness: number;
  /** Invariance-battery result: how far the unit is from a true scale-invariant ratio. */
  residual: number;
  untrained: number;
  passes: boolean;
  shape: 'monotone' | 'tuned' | 'weak';
  site: string;
  verdict: string;
  curve: [number, number][];
};

const UNITS: Unit[] = [
  {
    id: '300m-tl_L0_u954',
    variant: '300M-TL',
    label: 'L0 u954',
    index: 'NBR2',
    pair: 'SWIR1 vs SWIR2',
    eta2: 0.52,
    rho: -0.74,
    brightness: 0.409,
    residual: 0.046,
    untrained: 0.537,
    passes: true,
    shape: 'monotone',
    site: 'central Australia',
    verdict:
      'The strongest unit in the study. Its activation falls steadily as the SWIR1 to SWIR2 ratio rises, and that one ratio accounts for 52 percent of everything the unit does. It clears the invariance cutoff at a tenth of the residual its untrained twin shows.',
    curve: [
      [-0.043, 6.996], [0.068, 7.172], [0.086, 6.458], [0.103, 6.162], [0.122, 5.766],
      [0.142, 5.263], [0.161, 4.73], [0.181, 4.31], [0.201, 4.041], [0.221, 3.754],
      [0.239, 3.464], [0.258, 3.359], [0.276, 3.125], [0.295, 2.879], [0.314, 2.656],
      [0.337, 2.496], [0.361, 2.327], [0.385, 2.115], [0.419, 1.721], [0.482, 1.405]
    ]
  },
  {
    id: '300m-tl_L0_u875',
    variant: '300M-TL',
    label: 'L0 u875',
    index: 'NGRDI',
    pair: 'Green vs Red',
    eta2: 0.361,
    rho: 0.573,
    brightness: -0.525,
    residual: 0.049,
    untrained: 0.363,
    passes: true,
    shape: 'monotone',
    site: 'Mekong delta',
    verdict:
      'Reads visible greenness, the Green to Red ratio you could measure with an ordinary camera and no infrared. The response rises cleanly with it. The catch is the brightness term: a genuine ratio cannot tell how bright the scene was, and this one dims as the scene brightens, so it is a near ratio rather than a clean one.',
    curve: [
      [-0.366, -0.834], [-0.206, -0.34], [-0.176, -0.08], [-0.158, 0.003], [-0.14, 0.149],
      [-0.122, 0.285], [-0.099, 0.307], [-0.073, 0.429], [-0.045, 0.496], [-0.016, 0.555],
      [0.011, 0.613], [0.038, 0.69], [0.066, 0.721], [0.097, 0.769], [0.132, 0.801],
      [0.167, 0.862], [0.202, 0.894], [0.24, 0.865], [0.279, 0.88], [0.51, 1.457]
    ]
  },
  {
    id: '300m-tl_L0_u661',
    variant: '300M-TL',
    label: 'L0 u661',
    index: 'bare soil',
    pair: 'SWIR1 + Red vs NIR + Blue',
    eta2: 0.403,
    rho: 0.619,
    brightness: 0.398,
    residual: 0.06,
    untrained: 0.66,
    passes: false,
    shape: 'monotone',
    site: 'central Australia',
    verdict:
      'Tracks exposed soil strongly and smoothly, explaining 40 percent of its own variance, and still misses the ratio cutoff at 0.060. A useful reminder that tracking an index well and computing it are different claims, and this unit only earns the first.',
    curve: [
      [-0.519, 0.628], [-0.365, 0.581], [-0.313, 0.548], [-0.263, 0.601], [-0.221, 0.644],
      [-0.181, 0.704], [-0.142, 0.823], [-0.102, 0.945], [-0.064, 1.027], [-0.025, 1.107],
      [0.014, 1.154], [0.057, 1.168], [0.101, 1.157], [0.139, 1.167], [0.166, 1.212],
      [0.184, 1.28], [0.2, 1.361], [0.219, 1.516], [0.248, 1.798], [0.454, 2.095]
    ]
  },
  {
    id: '300m-tl_L0_u117',
    variant: '300M-TL',
    label: 'L0 u117',
    index: 'NGRDI',
    pair: 'Green vs Red',
    eta2: 0.056,
    rho: -0.167,
    brightness: 0.032,
    residual: 0.187,
    untrained: 0.778,
    passes: false,
    shape: 'weak',
    site: 'central Australia',
    verdict:
      'Flat across the entire range except for a single spike at one extreme. It fails the ratio test and tracks nothing in particular, and its patches have no common look. It is here because a census that shows only its winners is not a census.',
    curve: [
      [-0.366, 1.608], [-0.206, 0.959], [-0.176, 0.84], [-0.158, 0.836], [-0.14, 0.842],
      [-0.122, 0.83], [-0.099, 0.719], [-0.073, 0.683], [-0.045, 0.661], [-0.016, 0.664],
      [0.011, 0.659], [0.038, 0.669], [0.066, 0.696], [0.097, 0.7], [0.132, 0.728],
      [0.167, 0.715], [0.202, 0.65], [0.24, 0.637], [0.279, 0.696], [0.51, 0.731]
    ]
  },
  {
    id: 'tiny-tl_L0_u19',
    variant: 'tiny-TL',
    label: 'L0 u19',
    index: 'NDVI',
    pair: 'NIR vs Red',
    eta2: 0.757,
    rho: 0.833,
    brightness: -0.68,
    residual: 0.163,
    untrained: 0.393,
    passes: false,
    shape: 'monotone',
    site: 'Borneo',
    verdict:
      'The sharpest index tracker anywhere in this study. NDVI explains 76 percent of what it does, in an almost straight line, and it still fails the ratio test at 0.163. This is the whole argument in a single neuron: being readable as NDVI is not the same as computing NDVI.',
    curve: [
      [-0.431, -0.206], [0.1, -0.932], [0.146, -0.84], [0.161, -0.784], [0.182, -0.774],
      [0.212, -0.677], [0.256, -0.572], [0.322, -0.42], [0.402, -0.248], [0.471, -0.131],
      [0.529, -0.024], [0.58, 0.069], [0.623, 0.148], [0.662, 0.212], [0.699, 0.282],
      [0.736, 0.345], [0.775, 0.428], [0.815, 0.519], [0.853, 0.623], [0.909, 0.731]
    ]
  },
  {
    id: 'tiny-tl_L0_u78',
    variant: 'tiny-TL',
    label: 'L0 u78',
    index: 'NBR2',
    pair: 'SWIR1 vs SWIR2',
    eta2: 0.088,
    rho: 0.067,
    brightness: -0.083,
    residual: 0.038,
    untrained: 0.502,
    passes: true,
    shape: 'weak',
    site: 'WA wheatbelt',
    verdict:
      'The cleanest ratio in the study by the invariance test, 0.038, and yet almost nothing it does is explained by any index measured here. Every index lands between 0.07 and 0.09, brightness included, so none of them stands out. An open discrepancy, reported as one rather than filed under either answer.',
    curve: [
      [-0.043, 0.395], [0.068, 0.082], [0.086, 0.209], [0.103, 0.295], [0.122, 0.461],
      [0.142, 0.613], [0.161, 0.687], [0.181, 0.726], [0.201, 0.703], [0.221, 0.721],
      [0.239, 0.71], [0.258, 0.609], [0.276, 0.59], [0.295, 0.574], [0.314, 0.538],
      [0.337, 0.478], [0.361, 0.439], [0.385, 0.393], [0.419, 0.267], [0.482, 0.558]
    ]
  },
  {
    id: 'tiny-tl_L11_u78',
    variant: 'tiny-TL',
    label: 'L11 u78',
    index: 'NGRDI',
    pair: 'Green vs Red',
    eta2: 0.124,
    rho: -0.321,
    brightness: 0.26,
    residual: 0.035,
    untrained: 0.654,
    passes: true,
    shape: 'monotone',
    site: 'WA wheatbelt',
    verdict:
      'The same unit index eleven blocks deeper, and still the lowest residual of any unit tested. It peaks on slightly red ground and falls away through green, but only weakly: greenness explains 12 percent of it against brightness at 10 percent, which is too close to call it selective.',
    curve: [
      [-0.366, 0.432], [-0.206, 0.716], [-0.176, 0.602], [-0.158, 0.543], [-0.14, 0.463],
      [-0.122, 0.325], [-0.099, 0.189], [-0.073, 0.069], [-0.045, 0.017], [-0.016, -0.029],
      [0.011, -0.005], [0.038, -0.073], [0.066, -0.126], [0.097, -0.162], [0.132, -0.15],
      [0.167, -0.067], [0.202, -0.099], [0.24, -0.108], [0.279, -0.101], [0.51, -0.207]
    ]
  }
];

const W = 300;
const H = 158;
const PAD = { l: 30, r: 8, t: 12, b: 24 };

function TuningCurve({ unit, accent }: { unit: Unit; accent: string }) {
  const xs = unit.curve.map((p) => p[0]);
  const ys = unit.curve.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const sx = (v: number) =>
    PAD.l + ((v - x0) / (x1 - x0 || 1)) * (W - PAD.l - PAD.r);
  const sy = (v: number) =>
    H - PAD.b - ((v - y0) / (y1 - y0 || 1)) * (H - PAD.t - PAD.b);
  const path = unit.curve.map((p, i) => `${i ? 'L' : 'M'}${sx(p[0]).toFixed(1)} ${sy(p[1]).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
      aria-label={`Mean activation of ${unit.label} against ${unit.index}, ${unit.shape}`}>
      {[0, 0.5, 1].map((f) => (
        <line key={f} x1={PAD.l} x2={W - PAD.r}
          y1={PAD.t + f * (H - PAD.t - PAD.b)} y2={PAD.t + f * (H - PAD.t - PAD.b)}
          stroke="var(--border)" strokeWidth="1" />
      ))}
      <path d={path} fill="none" stroke={accent} strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round" />
      {unit.curve.map((p, i) => (
        <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r="2.1"
          fill="var(--bg)" stroke={accent} strokeWidth="1.3" />
      ))}
      <text x={PAD.l - 5} y={PAD.t + 4} textAnchor="end" fontSize="8"
        fill="var(--fg-muted)" fontFamily="ui-monospace, monospace">{y1.toFixed(1)}</text>
      <text x={PAD.l - 5} y={H - PAD.b} textAnchor="end" fontSize="8"
        fill="var(--fg-muted)" fontFamily="ui-monospace, monospace">{y0.toFixed(1)}</text>
      <text x={PAD.l} y={H - 8} fontSize="8" fill="var(--fg-muted)"
        fontFamily="ui-monospace, monospace">{x0.toFixed(2)}</text>
      <text x={W - PAD.r} y={H - 8} textAnchor="end" fontSize="8" fill="var(--fg-muted)"
        fontFamily="ui-monospace, monospace">{x1.toFixed(2)}</text>
      <text x={(W + PAD.l) / 2} y={H - 8} textAnchor="middle" fontSize="8"
        fill="var(--fg-muted)" fontFamily="ui-monospace, monospace">{unit.index} value</text>
    </svg>
  );
}

function Stat({ label, value, note, tone }: {
  label: string; value: string; note: string; tone?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] px-3 py-2">
      <p className={`${MONO} text-[var(--fg-muted)]`}>{label}</p>
      <p className="mt-1 font-mono text-sm tabular-nums" style={tone ? { color: tone } : undefined}>
        {value}
      </p>
      <p className="mt-0.5 text-[0.68rem] leading-snug text-[var(--fg-muted)]">{note}</p>
    </div>
  );
}

export function NeuronExplorer({ accent }: { accent: string }) {
  const [id, setId] = useState(UNITS[0].id);
  const unit = UNITS.find((u) => u.id === id) ?? UNITS[0];
  const variants = Array.from(new Set(UNITS.map((u) => u.variant)));

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)]">
      {/* Unit picker, grouped by model */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-[var(--border)] px-4 py-3">
        {variants.map((v) => (
          <div key={v} className="flex items-center gap-2">
            <span className={`${MONO} text-[var(--fg-muted)]`}>{v}</span>
            {UNITS.filter((u) => u.variant === v).map((u) => {
              const on = u.id === id;
              return (
                <button key={u.id} onClick={() => setId(u.id)}
                  aria-pressed={on}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.7rem] transition-colors ${
                    on
                      ? 'border-transparent text-[var(--bg)]'
                      : 'border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]'
                  }`}
                  style={on ? { background: accent } : undefined}>
                  <span className="h-1.5 w-1.5 rounded-full"
                    style={{ background: on ? 'var(--bg)' : u.passes ? accent : 'var(--fg-muted)' }} />
                  {u.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Keyed, with no exit animation: mode="wait" queues up and lags behind a quick
          series of clicks, which is exactly how someone compares two units. */}
      <motion.div key={unit.id}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="grid gap-5 p-4 sm:grid-cols-2">
          {/* What excites it */}
          <div>
            <p className={`${MONO} mb-2 text-[var(--fg-muted)]`}>
              the 6 patches it fires hardest on
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/${unit.id}.jpg`} loading="lazy"
              alt={`Six satellite patches that most activate unit ${unit.label}`}
              className="w-full rounded-lg border border-[var(--border)]" />
            <p className="mt-2 text-[0.72rem] leading-relaxed text-[var(--fg-muted)]">
              Outlined square is the patch itself, 480 m across. Mostly {unit.site}.
            </p>
          </div>

          {/* How it answers */}
          <div>
            <p className={`${MONO} mb-2 text-[var(--fg-muted)]`}>
              how it answers &middot; {unit.shape}
            </p>
            <TuningCurve unit={unit} accent={accent} />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Stat label="ratio residual" value={unit.residual.toFixed(3)}
                tone={unit.passes ? accent : undefined}
                note={`untrained twin ${unit.untrained.toFixed(3)} · cutoff 0.05`} />
              <Stat label="explains" value={`${Math.round(unit.eta2 * 100)}%`}
                note={`of its variance, via ${unit.pair}`} />
              <Stat label="brightness" value={unit.brightness >= 0 ? `+${unit.brightness.toFixed(2)}` : unit.brightness.toFixed(2)}
                note="a true ratio would sit at 0.00" />
              <Stat label="rank corr." value={unit.rho >= 0 ? `+${unit.rho.toFixed(2)}` : unit.rho.toFixed(2)}
                note={`with ${unit.index}, monotone only`} />
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[var(--fg-muted)] sm:col-span-2">
            {unit.verdict}
          </p>
      </motion.div>
    </div>
  );
}
