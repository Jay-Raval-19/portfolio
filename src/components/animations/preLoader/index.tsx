'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { opacity, slideUp } from '@/components/animations/preLoader/anim';

const words = ['नमस्ते', 'Hello', 'Build', 'Ship', 'Jay Raval'];

export default function PreLoader() {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (index === words.length - 1) return;
    const delay = index === 0 ? 700 : 140;
    const timer = setTimeout(() => setIndex(index + 1), delay);
    return () => clearTimeout(timer);
  }, [index]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
    }
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className="fixed z-50 flex h-screen w-screen items-center justify-center bg-[var(--bg)]"
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            variants={opacity}
            initial="initial"
            animate="enter"
            className="absolute font-display text-6xl italic tracking-tight text-[var(--fg)]"
          >
            {words[index]}
          </motion.p>
          <svg
            className="absolute top-0 h-[calc(100%+300px)] w-full"
            style={{ fill: 'var(--bg)' }}
          >
            <motion.path variants={curve} initial="initial" exit="exit" />
          </svg>
        </>
      )}
    </motion.div>
  );
}
