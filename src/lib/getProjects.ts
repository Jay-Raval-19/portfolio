import 'server-only';
import { supabasePublic } from './supabase';
import {
  defaultProjects,
  PATTERN_OPTIONS,
  Project,
  SIZE_OPTIONS,
  THEME_OPTIONS
} from './projectMeta';

// Coerce a raw DB row into a valid Project, guarding against bad enum values.
function normalize(row: Record<string, unknown>): Project {
  const theme = THEME_OPTIONS.includes(row.theme as never)
    ? (row.theme as Project['theme'])
    : 'blue';
  const pattern = PATTERN_OPTIONS.includes(row.pattern as never)
    ? (row.pattern as Project['pattern'])
    : 'grid';
  const size = SIZE_OPTIONS.includes(row.size as never)
    ? (row.size as Project['size'])
    : 'medium';

  return {
    id: row.id as string | undefined,
    slug: row.slug ? String(row.slug) : undefined,
    title: String(row.title ?? ''),
    kicker: String(row.kicker ?? ''),
    description: String(row.description ?? ''),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    date: String(row.date ?? ''),
    theme,
    pattern,
    size,
    sort_order: typeof row.sort_order === 'number' ? row.sort_order : 0
  };
}

/**
 * Fetch projects from Supabase, ordered by sort_order. Falls back to the
 * hardcoded defaults when Supabase is unconfigured, errors, or is empty.
 */
export async function getProjects(): Promise<Project[]> {
  const client = supabasePublic();
  if (!client) return defaultProjects;

  const { data, error } = await client
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error || !data || data.length === 0) return defaultProjects;

  const rows = data.map(normalize);
  // Add code-defined projects the table doesn't have yet, right after the
  // first (featured) card.
  const have = new Set(rows.map((p) => p.title));
  const extras = defaultProjects.filter((p) => p.alwaysShow && !have.has(p.title));
  rows.splice(1, 0, ...extras);
  return rows;
}
