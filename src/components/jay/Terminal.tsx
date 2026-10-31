'use client';

// Hidden terminal easter egg. Press ` / ~ anywhere to summon it.
// Commands: help, whoami, papers, projects, open <slug>, resume, gallery,
// theme, neofetch, clear, exit ... and a few surprises.

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { defaultProjects } from '@/lib/projectMeta';
import { ASCII_JAY } from './asciiJay';
import { isMobile } from '@/components/util';

// Custom event the header >_ button dispatches to toggle the terminal.
export const TERMINAL_EVENT = 'jay:terminal';
const SEEN_KEY = 'jr-term-seen';

type Line = { kind: 'in' | 'out' | 'accent' | 'art'; text: string };

const NEOFETCH_INFO: Array<[string, string]> = [
  ['user', 'jay@portfolio'],
  ['loc', 'new brunswick, NJ'],
  ['edu', 'BTech CSE ’26 · Ahmedabad University'],
  ['next', 'MSCS @ Rutgers · fall 2026'],
  ['focus', 'LLM reasoning · formal methods'],
  ['shipped', '4 papers · 8 projects · 1 internship'],
  ['fuel', 'chai, mostly'],
  ['status', 'open to research & collabs']
];

const BANNER: Line[] = [
  { kind: 'accent', text: 'jay.sh - portfolio shell' },
  { kind: 'out', text: "type 'help' to see commands · 'exit' or Esc to close" }
];

const PAPERS = [
  'Testing the Limits of LLMs on Regular Languages - EMNLP 2026 (under review)',
  'Beyond Memorization: LLM Reasoning on Unseen ToC Tasks - ACL Findings 2026 (accepted)',
  'Predicting Phase Transition in Cellular Automata - Chaos, Solitons & Fractals (under review)',
  'Understanding the Game of Collaboration through H-Index - (under revision)'
];

const HELP: string[] = [
  'help            this list',
  'whoami          who is jay?',
  'papers          research papers',
  'projects        things i’ve built',
  'open <slug>     open a project page (try: open riva-cervical-cytology)',
  'resume          download the resume (pdf)',
  'gallery         enter the darkroom',
  'theme           toggle light/dark',
  'neofetch        system info',
  'clear           clear the screen',
  'exit            close the terminal'
];

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return (
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.isContentEditable
  );
}

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const demoTimers = useRef<number[]>([]);
  const router = useRouter();
  const { theme, toggle } = useTheme();

  // Cancel the first-visit demo (if pending or mid-flight) - called whenever
  // the visitor takes over so the terminal doesn't close under their fingers.
  const cancelDemo = useCallback(() => {
    demoTimers.current.forEach((t) => window.clearTimeout(t));
    demoTimers.current = [];
  }, []);

  const markSeen = useCallback(() => {
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {}
  }, []);

  // Global summon key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === '`' || e.key === '~') && !isTypingTarget(e.target)) {
        e.preventDefault();
        cancelDemo();
        markSeen();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        cancelDemo();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cancelDemo, markSeen]);

  // Header >_ button
  useEffect(() => {
    const onToggle = () => {
      cancelDemo();
      markSeen();
      setOpen((o) => !o);
    };
    window.addEventListener(TERMINAL_EVENT, onToggle);
    return () => window.removeEventListener(TERMINAL_EVENT, onToggle);
  }, [cancelDemo, markSeen]);

  // Focus + autoscroll
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, open]);

  const print = useCallback((out: Line[]) => {
    setLines((prev) => [...prev, ...out]);
  }, []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;
      print([{ kind: 'in', text: cmd }]);
      setHistory((h) => [cmd, ...h]);
      setHistIdx(-1);

      const [head, ...rest] = cmd.toLowerCase().split(/\s+/);
      const arg = rest.join(' ');

      switch (head) {
        case 'help':
          print(HELP.map((t) => ({ kind: 'out', text: t }) as Line));
          break;
        case 'whoami':
          print([
            { kind: 'out', text: 'jay raval - cs graduate.' },
            { kind: 'out', text: ' ' },
            {
              kind: 'out',
              text: 'recently wrapped up my BTech in Computer Science and Engineering at Ahmedabad University.'
            },
            {
              kind: 'out',
              text: 'next stop: Rutgers-New Brunswick for an MS in Computer Science.'
            },
            { kind: 'out', text: ' ' },
            {
              kind: 'out',
              text: 'i enjoy solving problems at the intersection of theory and engineering, including'
            },
            {
              kind: 'out',
              text: 'LLM reasoning, graph algorithms, formal languages, and complex systems.'
            },
            { kind: 'out', text: ' ' },
            {
              kind: 'out',
              text: "so far, that's led to four research papers, a summer at an AI startup,"
            },
            {
              kind: 'out',
              text: 'and more nights spent building than sleeping.'
            }
          ]);
          break;
        case 'papers':
          print(
            PAPERS.map(
              (p, i) => ({ kind: 'out', text: `[${i + 1}] ${p}` }) as Line
            )
          );
          break;
        case 'projects':
        case 'ls':
          print(
            defaultProjects.map(
              (p) =>
                ({
                  kind: 'out',
                  text: `${(p.slug ?? '').padEnd(26)} ${p.title}`
                }) as Line
            )
          );
          print([
            { kind: 'accent', text: "open one with: open <slug>" }
          ]);
          break;
        case 'open': {
          const match = defaultProjects.find((p) => p.slug === arg);
          if (match?.externalUrl) {
            print([{ kind: 'accent', text: `→ ${match.externalUrl}` }]);
            setOpen(false);
            window.open(match.externalUrl, '_blank', 'noopener,noreferrer');
          } else if (match) {
            print([{ kind: 'accent', text: `→ /projects/${arg}` }]);
            setOpen(false);
            router.push(`/projects/${arg}`);
          } else {
            print([
              {
                kind: 'out',
                text: `no project '${arg}'. try 'projects' to list slugs.`
              }
            ]);
          }
          break;
        }
        case 'resume':
        case 'cv':
          print([{ kind: 'accent', text: '→ Jay_Raval_Resume.pdf' }]);
          window.open('/Jay_Raval_Resume.pdf', '_blank');
          break;
        case 'gallery':
        case 'darkroom':
          print([{ kind: 'accent', text: '→ entering the darkroom' }]);
          setOpen(false);
          router.push('/gallery');
          break;
        case 'contact':
        case 'email':
          print([{ kind: 'accent', text: '→ jay.mrugesh.raval@gmail.com' }]);
          window.location.href = 'mailto:jay.mrugesh.raval@gmail.com';
          break;
        case 'theme':
          toggle();
          print([
            {
              kind: 'out',
              text: `theme → ${theme === 'dark' ? 'light' : 'dark'}. easy on the eyes.`
            }
          ]);
          break;
        case 'neofetch':
          print([{ kind: 'art', text: '' }]);
          break;
        case 'sudo':
          if (arg === 'hire jay') {
            print([
              { kind: 'accent', text: '[sudo] permission granted ✓' },
              {
                kind: 'out',
                text: 'excellent decision. forwarding you to the contact section...'
              }
            ]);
            setTimeout(() => {
              setOpen(false);
              const el = document.querySelector('#contact');
              const lenis = (window as any).__lenis;
              if (lenis && el) lenis.scrollTo(el as HTMLElement);
              else el?.scrollIntoView({ behavior: 'smooth' });
            }, 900);
          } else {
            print([
              {
                kind: 'out',
                text: `jay is not in the sudoers file. this incident will be reported. (hint: sudo hire jay)`
              }
            ]);
          }
          break;
        case 'clear':
          setLines([]);
          break;
        case 'exit':
        case 'quit':
        case 'q':
          setOpen(false);
          break;
        default:
          print([
            {
              kind: 'out',
              text: `command not found: ${head} - try 'help'`
            }
          ]);
      }
    },
    [print, router, theme, toggle]
  );

  // Keep a ref to the latest run() so the one-shot demo effect can use it
  // without re-subscribing.
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  }, [run]);

  // First-visit demo: open once, type `neofetch`, show the face, bow out.
  // Desktop only - mobile visitors get the header >_ button instead.
  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return;
    }
    if (isMobile()) return;

    const timers = demoTimers.current;
    const at = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms));

    // Wait for the hero to settle before butting in.
    at(4000, () => {
      markSeen();
      setOpen(true);
    });
    // Type "neofetch" character by character.
    const cmd = 'neofetch';
    cmd.split('').forEach((_, i) => {
      at(4600 + i * 90, () => setValue(cmd.slice(0, i + 1)));
    });
    at(4600 + cmd.length * 90 + 350, () => {
      setValue('');
      runRef.current('neofetch');
    });
    at(9800, () =>
      setLines((prev) => [
        ...prev,
        { kind: 'accent', text: 'press ~ anytime to bring me back' }
      ])
    );
    at(12300, () => setOpen(false));

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      demoTimers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Visitor takes over mid-demo → stop the scripted close.
    cancelDemo();
    if (e.key === 'Enter') {
      run(value);
      setValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      if (history[next]) {
        setHistIdx(next);
        setValue(history[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = histIdx - 1;
      setHistIdx(next);
      setValue(next >= 0 ? history[next] : '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const cmds = HELP.map((h) => h.split(/\s+/)[0]);
      const hit = cmds.find((c) => c.startsWith(value.toLowerCase()));
      if (hit) setValue(hit + ' ');
    } else if (e.key === '`' || e.key === '~') {
      // let the summon key close it even while typing
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[#0c0c0c]/95 shadow-2xl backdrop-blur-md">
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    cancelDemo();
                    setOpen(false);
                  }}
                  aria-label="close terminal"
                  className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"
                />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
                jay@portfolio: ~
              </span>
              <span className="font-mono text-[0.6rem] text-white/25">
                esc to close
              </span>
            </div>

            {/* Output */}
            <div
              ref={scrollRef}
              className="max-h-72 overflow-y-auto px-4 py-3 font-mono text-[0.8rem] leading-relaxed"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) =>
                line.kind === 'art' ? (
                  <div
                    key={i}
                    className="my-2 flex flex-wrap items-center gap-x-5 gap-y-3"
                  >
                    <pre className="select-none font-mono text-[4.5px] leading-[5px] text-[#8fbbff]">
                      {ASCII_JAY.join('\n')}
                    </pre>
                    <div className="text-[0.75rem]">
                      <p className="text-[#8fbbff]">{NEOFETCH_INFO[0][1]}</p>
                      <p className="text-white/40">─────────────</p>
                      {NEOFETCH_INFO.slice(1).map(([k, v]) => (
                        <p key={k}>
                          <span className="text-[#8fbbff]">{k}</span>
                          <span className="text-white/60">: {v}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="whitespace-pre-wrap break-words">
                    {line.kind === 'in' ? (
                      <span className="text-white/90">
                        <span className="text-emerald-400">❯ </span>
                        {line.text}
                      </span>
                    ) : line.kind === 'accent' ? (
                      <span className="text-[#8fbbff]">{line.text}</span>
                    ) : (
                      <span className="text-white/60">{line.text}</span>
                    )}
                  </div>
                )
              )}

              {/* Prompt */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400">❯</span>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onInputKey}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="terminal input"
                  className="flex-1 border-none bg-transparent font-mono text-[0.8rem] text-white/90 caret-emerald-400 outline-none placeholder:text-white/25"
                  placeholder="help"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
