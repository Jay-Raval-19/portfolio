'use client';
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { isMobile } from '@/components/util';

type CursorProps = {
  isActive?: boolean;
  text?: string;
};

export default function ContrastCursor({ isActive, text }: CursorProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 500 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;
  if (typeof navigator !== 'undefined' && isMobile()) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[60] flex items-center justify-center rounded-full"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        width: isActive ? 140 : isClicked ? 20 : 32,
        height: isActive ? 140 : isClicked ? 20 : 32,
        backgroundColor: '#ffffff',
        mixBlendMode: 'difference'
      }}
      animate={{ scale: isClicked ? 0.9 : 1 }}
      transition={{ duration: 0.15 }}
    >
      {isActive && text && (
        <span className="font-mono text-xs uppercase tracking-wider text-[var(--bg)]">
          {text}
        </span>
      )}
    </motion.div>
  );
}
