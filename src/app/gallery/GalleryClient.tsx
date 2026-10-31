'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { Photo } from '@/lib/photoMeta';

// Frames likely to be above the fold on a wide screen (3 masonry columns).
// These skip lazy-loading and get fetch priority so the sheet isn't blank.
const EAGER_COUNT = 3;

// Column widths the masonry actually renders at, so Next requests a right-sized
// source instead of the full-resolution original.
const SIZES = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw';

export default function GalleryClient({ frames }: { frames: Photo[] }) {
  useEffect(() => {
    document.documentElement.classList.add('darkroom');

    // Image-protection deterrents while the darkroom is open:
    // no right-click menu, no drag-out, no Ctrl+S. (A determined visitor can
    // always screenshot - this only closes the casual routes.)
    const blockContext = (e: MouseEvent) => e.preventDefault();
    const blockDrag = (e: DragEvent) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['s', 'S', 'u', 'U'].includes(e.key)) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', blockContext);
    document.addEventListener('dragstart', blockDrag);
    document.addEventListener('keydown', blockKeys);

    return () => {
      document.documentElement.classList.remove('darkroom');
      document.removeEventListener('contextmenu', blockContext);
      document.removeEventListener('dragstart', blockDrag);
      document.removeEventListener('keydown', blockKeys);
    };
  }, []);

  return (
    <main
      className="relative min-h-screen select-none bg-[#0a0908] text-[#e8e4dc]"
      style={{ WebkitTouchCallout: 'none' } as React.CSSProperties}
    >
      {/* Ambient red safelight glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(1200px 600px at 85% -10%, rgba(170, 40, 30, 0.14), transparent 60%), radial-gradient(800px 500px at 10% 110%, rgba(170, 40, 30, 0.08), transparent 60%)'
        }}
      />

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-16"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#8a837a] transition-colors hover:text-[#e8e4dc]"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          back to surface
        </Link>
        <div className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[#8a837a]">
          safelight · 25w · red
        </div>
      </motion.div>

      {/* Masthead */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="relative z-10 px-6 pb-16 pt-20 lg:px-16 lg:pb-24 lg:pt-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 font-mono text-[0.65rem] uppercase tracking-[0.4em] text-[#aa4a3a]">
            · darkroom · no. 01
          </div>
          <h1 className="font-display text-6xl italic leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-[10rem]">
            the darkroom.
          </h1>
          <div className="mt-10 grid max-w-3xl grid-cols-1 gap-6 text-[#c9c3b8] md:grid-cols-2">
            <p className="font-display text-xl italic leading-relaxed">
              a side door. photographs taken when the code was quiet.
            </p>
            <p className="font-mono text-[0.7rem] uppercase leading-loose tracking-[0.2em] text-[#8a837a]">
              unlisted / undeveloped / unfinished.
              <br />
              no nav. no analytics. no hurry.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Contact sheet */}
      <section className="relative z-10 px-6 pb-32 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-baseline justify-between border-t border-[#2a2724] pt-6">
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#8a837a]">
              contact sheet · 2023–2025
            </div>
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#8a837a]">
              {frames.length} frames
            </div>
          </div>

          <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
            {frames.map((f, i) => (
              <motion.figure
                key={f.id ?? f.caption ?? i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                // Positive margin starts the reveal before the frame is on
                // screen; the stagger is capped so late frames don't inherit a
                // delay that grows with their index.
                viewport={{ once: true, margin: '200px' }}
                transition={{ duration: 0.7, delay: Math.min(i, 2) * 0.08 }}
                className="group mb-16 block break-inside-avoid"
              >
                <div
                  className="relative overflow-hidden bg-[#15120f] ring-1 ring-[#2a2724] transition-all duration-500 group-hover:ring-[#5a4a3a]"
                  style={{ aspectRatio: f.aspect || '4/5' }}
                >
                  {f.image_url ? (
                    <>
                      <Image
                        src={f.image_url}
                        alt={f.caption}
                        fill
                        sizes={SIZES}
                        quality={80}
                        priority={i < EAGER_COUNT}
                        draggable={false}
                        className="pointer-events-none select-none object-cover opacity-90 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.02]"
                        style={
                          {
                            WebkitUserDrag: 'none',
                            WebkitTouchCallout: 'none'
                          } as React.CSSProperties
                        }
                      />
                      {/* transparent shield so the image is never the
                          right-click / long-press target */}
                      <div aria-hidden className="absolute inset-0" />
                    </>
                  ) : (
                    <>
                      {/* placeholder grain when no image is uploaded yet */}
                      <div
                        className="absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
                        style={{
                          background:
                            'linear-gradient(135deg, #1a1714 0%, #0f0d0b 40%, #1c1815 100%)'
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-25 mix-blend-overlay"
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")"
                        }}
                      />
                    </>
                  )}
                  <div className="absolute left-3 top-3 font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[#8a837a]">
                    {String(i + 1).padStart(2, '0')} / {frames.length}
                  </div>
                  <div className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-[#aa4a3a]" />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                  <div>
                    <div className="font-display text-lg italic text-[#e8e4dc]">
                      {f.caption}
                    </div>
                    <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[#8a837a]">
                      {f.location} · {f.date}
                    </div>
                  </div>
                  <div className="shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[#8a837a]">
                    no. {String(i + 1).padStart(2, '0')}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Footer colophon */}
      <footer className="relative z-10 border-t border-[#2a2724] px-6 py-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[#8a837a] md:flex-row">
          <div>shot on glass · scanned on grain · printed in silence</div>
          <Link href="/" className="transition-colors hover:text-[#e8e4dc]">
            ← return to surface
          </Link>
        </div>
      </footer>
    </main>
  );
}
