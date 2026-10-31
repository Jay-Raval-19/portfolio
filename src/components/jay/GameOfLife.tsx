'use client';
import { useEffect, useRef } from 'react';

type Props = {
  rows?: number;
  cellSize?: number;
  stepMs?: number;
  chars?: string;
  density?: number;
};

export default function GameOfLife({
  rows = 12,
  cellSize = 14,
  stepMs = 140,
  chars = 'jayraval·game·of·life·',
  density = 0.3
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols = 0;
    let grid = new Uint8Array(0);
    let next = new Uint8Array(0);
    let stepId: ReturnType<typeof setInterval> | null = null;
    let tickCount = 0;
    let charOffset = 0;

    const readAccent = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--accent')
        .trim() || '#8fbbff';

    const idx = (x: number, y: number) => y * cols + x;

    const seed = () => {
      for (let i = 0; i < grid.length; i++) {
        grid[i] = Math.random() < density ? 1 : 0;
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      const h = rows * cellSize;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      cols = Math.max(1, Math.floor(w / cellSize));
      grid = new Uint8Array(cols * rows);
      next = new Uint8Array(cols * rows);
      seed();
      tickCount = 0;
    };

    const step = () => {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = (x + dx + cols) % cols;
              const ny = (y + dy + rows) % rows;
              n += grid[idx(nx, ny)];
            }
          }
          const alive = grid[idx(x, y)];
          next[idx(x, y)] =
            (alive && (n === 2 || n === 3)) || (!alive && n === 3) ? 1 : 0;
        }
      }
      const tmp = grid;
      grid = next;
      next = tmp;
    };

    const draw = () => {
      const w = wrap.clientWidth;
      const h = rows * cellSize;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = readAccent();
      ctx.font = `${cellSize - 2}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (grid[idx(x, y)]) {
            const ch = chars[(charOffset + x + y * 3) % chars.length];
            ctx.fillText(ch, x * cellSize + 1, y * cellSize);
          }
        }
      }
    };

    const tick = () => {
      step();
      charOffset++;
      tickCount++;
      let pop = 0;
      for (let i = 0; i < grid.length; i++) pop += grid[i];
      if (tickCount > 220 || pop < cols * 0.35 || pop > grid.length * 0.65) {
        seed();
        tickCount = 0;
      }
      draw();
    };

    resize();
    draw();
    stepId = setInterval(tick, stepMs);

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      if (stepId) clearInterval(stepId);
      window.removeEventListener('resize', onResize);
    };
  }, [rows, cellSize, stepMs, chars, density]);

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
}
