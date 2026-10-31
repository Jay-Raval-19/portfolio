'use client';
import { useState } from 'react';

type PhotoProps = {
  className?: string;
  rounded?: 'full' | '2xl' | '3xl' | 'none';
  monogramSize?: string;
  src?: string;
};

export default function Photo({
  className = '',
  rounded = '2xl',
  monogramSize = 'text-6xl',
  src = '/images/jay.jpg'
}: PhotoProps) {
  const [errored, setErrored] = useState(false);
  const radius =
    rounded === 'full'
      ? 'rounded-full'
      : rounded === '3xl'
        ? 'rounded-[2rem]'
        : rounded === '2xl'
          ? 'rounded-3xl'
          : '';

  if (errored) {
    return (
      <div
        className={`${className} ${radius} relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-violet-500/20`}
      >
        {/* noise pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="relative flex flex-col items-center gap-2">
          <span
            className={`${monogramSize} font-serif italic text-[var(--fg)]/90 tracking-tight`}
          >
            JR
          </span>
          <span className="text-[0.65rem] font-mono uppercase tracking-[0.2em] text-[var(--fg-muted)]">
            drop photo to /public{src}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Jay Raval"
      onError={() => setErrored(true)}
      className={`${className} ${radius} object-cover`}
    />
  );
}
