import 'server-only';
import { supabasePublic } from './supabase';
import { defaultFrames, Photo } from './photoMeta';

function normalize(row: Record<string, unknown>): Photo {
  return {
    id: row.id as string | undefined,
    caption: String(row.caption ?? ''),
    location: String(row.location ?? ''),
    date: String(row.date ?? ''),
    aspect: String(row.aspect ?? '4/5') || '4/5',
    image_url: String(row.image_url ?? ''),
    image_path: (row.image_path as string | undefined) ?? undefined,
    sort_order: typeof row.sort_order === 'number' ? row.sort_order : 0
  };
}

/**
 * Fetch photos from Supabase, ordered by sort_order. Falls back to the
 * hardcoded default frames when Supabase is unconfigured, errors, or is empty.
 */
export async function getPhotos(): Promise<Photo[]> {
  const client = supabasePublic();
  if (!client) return defaultFrames;

  const { data, error } = await client
    .from('photos')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error || !data || data.length === 0) return defaultFrames;
  return data.map(normalize);
}
