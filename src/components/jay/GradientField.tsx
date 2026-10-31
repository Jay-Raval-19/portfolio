'use client';
import { useEffect, useRef } from 'react';

type Props = {
  height?: number;
  cellSize?: number;
  blobCount?: number;
  fps?: number;
};

type RGB = [number, number, number];

function parseColor(str: string): RGB {
  const trimmed = str.trim();
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    const full =
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex;
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16)
    ];
  }
  const m = trimmed.match(/\d+(\.\d+)?/g);
  if (m && m.length >= 3) {
    return [Math.round(+m[0]), Math.round(+m[1]), Math.round(+m[2])];
  }
  return [10, 10, 10];
}

function buildLUT(stops: Array<[number, RGB]>, size = 256): string[] {
  const lut: string[] = [];
  for (let i = 0; i < size; i++) {
    const t = i / (size - 1);
    let j = 0;
    while (j < stops.length - 2 && stops[j + 1][0] < t) j++;
    const [t0, c0] = stops[j];
    const [t1, c1] = stops[j + 1];
    const u = t1 === t0 ? 0 : (t - t0) / (t1 - t0);
    const r = Math.round(c0[0] + (c1[0] - c0[0]) * u);
    const g = Math.round(c0[1] + (c1[1] - c0[1]) * u);
    const b = Math.round(c0[2] + (c1[2] - c0[2]) * u);
    lut.push(`rgb(${r},${g},${b})`);
  }
  return lut;
}

function readThemePalette(): RGB[] {
  const s = getComputedStyle(document.documentElement);
  const bg = parseColor(s.getPropertyValue('--bg') || '#0a0a0a');
  const mid = parseColor(s.getPropertyValue('--accent') || '#8fbbff');
  const hi = parseColor(s.getPropertyValue('--accent-warm') || '#f4a261');
  return [bg, mid, hi];
}

export default function GradientField({
  height = 100,
  cellSize = 10,
  blobCount = 7,
  fps = 20
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const LUT_SIZE = 256;
    let lut: string[] = [];

    const rebuildLUT = () => {
      const [bg, mid, hi] = readThemePalette();
      lut = buildLUT(
        [
          [0.0, bg],
          [0.6, mid],
          [1.0, hi]
        ],
        LUT_SIZE
      );
    };

    let cols = 0;
    let rows = 0;
    let stepId: ReturnType<typeof setInterval> | null = null;
    const blobs: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      s: number;
    }> = [];

    const initBlobs = () => {
      blobs.length = 0;
      for (let i = 0; i < blobCount; i++) {
        blobs.push({
          x: Math.random() * cols,
          y: Math.random() * rows,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.04,
          r: 2.5 + Math.random() * 3.5,
          s: 0.5 + Math.random() * 0.7
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      canvas.width = w * dpr;
      canvas.height = height * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      cols = Math.max(1, Math.floor(w / cellSize));
      rows = Math.max(1, Math.floor(height / cellSize));
      initBlobs();
    };

    const draw = () => {
      for (const b of blobs) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.r) b.x = cols + b.r;
        if (b.x > cols + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = rows + b.r;
        if (b.y > rows + b.r) b.y = -b.r;
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let v = 0.1;
          for (const b of blobs) {
            const dx = x - b.x;
            const dy = y - b.y;
            const d2 = dx * dx + dy * dy;
            v += b.s * Math.exp(-d2 / (2 * b.r * b.r));
          }
          const value = Math.max(0, Math.min(0.999, v * 0.5));
          ctx.fillStyle = lut[Math.floor(value * (LUT_SIZE - 1))];
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    };

    rebuildLUT();
    resize();
    draw();
    stepId = setInterval(draw, Math.round(1000 / fps));

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    const themeObserver = new MutationObserver(() => {
      rebuildLUT();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      if (stepId) clearInterval(stepId);
      window.removeEventListener('resize', onResize);
      themeObserver.disconnect();
    };
  }, [height, cellSize, blobCount, fps]);

  const fadeMask =
    'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)';

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden"
      style={{
        height,
        maskImage: fadeMask,
        WebkitMaskImage: fadeMask
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
