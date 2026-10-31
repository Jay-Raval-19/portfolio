// Shared project types + style maps. NO server/Supabase imports here so this
// file is safe to import from client components.

export type ProjectTheme =
  | 'blue'
  | 'emerald'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'slate';

export type ProjectPattern = 'grid' | 'dots' | 'lines' | 'noise' | 'circuit';

export type ProjectSize = 'featured' | 'wide' | 'medium' | 'full';

export type Project = {
  id?: string;
  slug?: string;
  title: string;
  kicker: string;
  description: string;
  tags: string[];
  date: string;
  theme: ProjectTheme;
  pattern: ProjectPattern;
  size: ProjectSize;
  sort_order?: number;
  // When set, the card links straight to this URL instead of a detail page.
  externalUrl?: string;
  // Code-defined projects shown even when the Supabase table has rows
  // that don't include them.
  alwaysShow?: boolean;
};

// Full literal class strings so Tailwind's JIT can see them at build time.
export const themes: Record<ProjectTheme, { gradient: string; accent: string }> =
  {
    blue: {
      gradient: 'from-blue-500/40 via-indigo-500/30 to-purple-600/40',
      accent: '#3b82f6'
    },
    emerald: {
      gradient: 'from-emerald-500/40 via-teal-500/30 to-cyan-500/40',
      accent: '#10b981'
    },
    violet: {
      gradient: 'from-violet-500/40 via-purple-500/30 to-fuchsia-500/40',
      accent: '#8b5cf6'
    },
    rose: {
      gradient: 'from-rose-500/40 via-pink-500/30 to-orange-500/40',
      accent: '#f43f5e'
    },
    amber: {
      gradient: 'from-amber-500/40 via-orange-500/30 to-red-500/40',
      accent: '#f59e0b'
    },
    slate: {
      gradient: 'from-slate-500/40 via-zinc-500/30 to-gray-500/40',
      accent: '#94a3b8'
    }
  };

export const sizes: Record<ProjectSize, string> = {
  featured: 'md:col-span-4 md:row-span-2',
  wide: 'md:col-span-3',
  medium: 'md:col-span-2',
  full: 'md:col-span-6'
};

/**
 * Assign card sizes by position so every row of the 6-column grid is filled,
 * whatever the number of projects: one featured card (4 cols, 2 rows) with two
 * medium cards beside it, then rows of two wide cards (a lone last card spans
 * the full row). Per-project sizes from the database are not used, since they
 * leave gaps whenever a project is added or removed.
 */
export function autoLayout(list: Project[]): Project[] {
  if (list.length < 3) return list;
  const rest = list.length - 3;
  return list.map((p, i) => {
    let size: ProjectSize;
    if (i === 0) size = 'featured';
    else if (i < 3) size = 'medium';
    else size = rest % 2 === 1 && i === list.length - 1 ? 'full' : 'wide';
    return { ...p, size };
  });
}

export const THEME_OPTIONS = Object.keys(themes) as ProjectTheme[];
export const PATTERN_OPTIONS: ProjectPattern[] = [
  'grid',
  'dots',
  'lines',
  'noise',
  'circuit'
];
export const SIZE_OPTIONS: ProjectSize[] = ['featured', 'wide', 'medium'];

// Fallback content used when Supabase isn't configured or the table is empty.
export const defaultProjects: Project[] = [
  {
    slug: 'hybrid-p2p-cdn',
    title: 'Hybrid P2P - CDN',
    kicker: 'featured · 2025',
    description:
      'A self-organizing mesh of 160 lightweight Go peers + CDN edge/origin tiers, 78% cache hits, 65% lower bandwidth costs, 47% faster delivery.',
    tags: ['Go', 'Docker', 'Redis', 'PostgreSQL', 'WebSocket', 'HLS'],
    date: 'Sep – Nov 2025',
    theme: 'blue',
    pattern: 'circuit',
    size: 'featured'
  },
  {
    slug: 'spectral-index-eo',
    title: 'Spectral Index - EO Model',
    kicker: 'research · 2026',
    description:
      'Do Earth-observation foundation models compute spectral indices or only make them decodable? A pre-registered test across all 15 band-pair ratios and six Prithvi-EO-2.0 variants.',
    tags: ['PyTorch', 'Prithvi-EO-2.0', 'Interpretability', 'Remote Sensing'],
    date: 'Sep - Oct 2026',
    theme: 'emerald',
    pattern: 'grid',
    size: 'medium',
    alwaysShow: true
  },
  {
    slug: 'riva-cervical-cytology',
    title: 'RIVA Cervical Cytology',
    kicker: 'deep learning · 2025',
    description:
      'A 5-model detection ensemble (DINO-DETR + MambaVision, Cellpose-SAM) for nucleus localisation on Pap smears, 0.571 mAP via Weighted Box Fusion.',
    tags: ['PyTorch', 'MambaVision', 'DINO-DETR', 'Cellpose-SAM', 'WBF'],
    date: '2025',
    theme: 'rose',
    pattern: 'dots',
    size: 'medium'
  },
  {
    slug: 'sourceasy',
    title: 'Sourceasy.ai',
    kicker: 'internship',
    externalUrl: 'https://sourceasy.ai/',
    description:
      "India's first AI-powered B2B chemical sourcing platform, WhatsApp AI agent + Pinecone supplier matching.",
    tags: ['React', 'Python', 'Pinecone', 'Twilio'],
    date: 'May – Jul 2025',
    theme: 'emerald',
    pattern: 'dots',
    size: 'medium'
  },
  {
    slug: 'read-ai',
    title: 'Read.AI',
    kicker: 'side project',
    description:
      'Context-aware study assistant. PDFs → vector embeddings → Q&A with LLAMA + auto-generated flashcards and quizzes.',
    tags: ['React', 'Node.js', 'LLAMA', 'Vector DB'],
    date: 'Oct 2024 – Jan 2025',
    theme: 'violet',
    pattern: 'noise',
    size: 'wide'
  },
  {
    slug: 'digivote',
    title: 'Digivote',
    kicker: 'coursework',
    description:
      'A DPoS voting blockchain in Go on Tendermint, validator elections, vote delegation, auto-runoff proposals + an Ethereum contract layer.',
    tags: ['Go', 'Tendermint', 'Solidity', 'Ethereum', 'Bubble Tea'],
    date: 'Jan – Apr 2025',
    theme: 'amber',
    pattern: 'grid',
    size: 'wide'
  },
  {
    slug: 'vehicle-stop-classifier',
    title: 'Vehicle Stop Classifier',
    kicker: 'research',
    description:
      'ML pipeline classifying vehicle behaviour at intersections from aerial trajectory data, Random Forest, K-Means, HMM.',
    tags: ['Python', 'scikit-learn', 'HMM'],
    date: 'Jan – Apr 2025',
    theme: 'slate',
    pattern: 'lines',
    size: 'medium'
  },
  {
    slug: 'advanced-aes',
    title: 'Advanced AES',
    kicker: 'systems',
    description:
      'Full AES in C++, 128/192/256-bit keys, ECB/CBC/CTR, thread-safe key generation.',
    tags: ['C++', 'STL', 'Threading'],
    date: 'Aug – Nov 2023',
    theme: 'blue',
    pattern: 'grid',
    size: 'medium'
  },
  {
    slug: 'facial-detection',
    title: 'Facial Detection',
    kicker: 'computer vision',
    description:
      'Custom face + feature detector using skin-tone colour segmentation and k-means clustering in LAB colour space.',
    tags: ['MATLAB', 'Image Processing', 'K-Means'],
    date: 'Aug – Nov 2023',
    theme: 'emerald',
    pattern: 'noise',
    size: 'medium'
  }
];

// Deterministic slug for a project regardless of data source (DB or defaults).
// Falls back to a title lookup, then to a slugified title.
const SLUG_BY_TITLE: Record<string, string> = Object.fromEntries(
  defaultProjects.map((p) => [p.title, p.slug as string])
);

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function projectSlug(project: Project): string {
  return project.slug ?? SLUG_BY_TITLE[project.title] ?? slugify(project.title);
}

// Slugs that have a dedicated detail page under /projects/<slug>.
export const DETAIL_SLUGS = new Set(defaultProjects.map((p) => p.slug as string));
