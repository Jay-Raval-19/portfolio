import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabasePublic } from '@/lib/supabase';
import { checkAdmin, dbError } from '@/lib/adminAuth';
import {
  PATTERN_OPTIONS,
  SIZE_OPTIONS,
  THEME_OPTIONS
} from '@/lib/projectMeta';

export const dynamic = 'force-dynamic';

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

type ProjectRow = {
  title: string;
  kicker: string;
  description: string;
  tags: string[];
  date: string;
  theme: string;
  pattern: string;
  size: string;
  sort_order: number;
};

type ParseResult =
  | { ok: false; error: string }
  | { ok: true; row: ProjectRow };

// Validate + coerce an incoming project payload into a clean DB row.
function parseBody(body: Record<string, unknown>): ParseResult {
  const title = String(body.title ?? '').trim();
  if (!title) return { ok: false, error: 'Title is required' };

  const tags = Array.isArray(body.tags)
    ? body.tags.map((t) => String(t).trim()).filter(Boolean)
    : String(body.tags ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

  const theme = THEME_OPTIONS.includes(body.theme as never)
    ? (body.theme as string)
    : 'blue';
  const pattern = PATTERN_OPTIONS.includes(body.pattern as never)
    ? (body.pattern as string)
    : 'grid';
  const size = SIZE_OPTIONS.includes(body.size as never)
    ? (body.size as string)
    : 'medium';

  return {
    ok: true,
    row: {
      title,
      kicker: String(body.kicker ?? '').trim(),
      description: String(body.description ?? '').trim(),
      tags,
      date: String(body.date ?? '').trim(),
      theme,
      pattern,
      size,
      sort_order: Number.isFinite(Number(body.sort_order))
        ? Number(body.sort_order)
        : 0
    }
  };
}

// GET is public (same data the site reads) - used to populate the admin list.
export async function GET() {
  // Public data only, so use the anon client (respects RLS), not the service key.
  const db = supabasePublic();
  if (!db)
    return NextResponse.json(
      { error: 'Supabase is not configured on the server.' },
      { status: 503 }
    );

  const { data, error } = await db
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) return dbError(error);
  return NextResponse.json({ projects: data ?? [] });
}

export async function POST(req: NextRequest) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  const db = supabaseAdmin();
  if (!db)
    return NextResponse.json(
      { error: 'Supabase is not configured on the server.' },
      { status: 503 }
    );

  const parsed = parseBody(await req.json());
  if (!parsed.ok) return badRequest(parsed.error);

  const { data, error } = await db
    .from('projects')
    .insert(parsed.row)
    .select()
    .single();

  if (error) return dbError(error);
  return NextResponse.json({ project: data });
}

export async function PUT(req: NextRequest) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  const db = supabaseAdmin();
  if (!db)
    return NextResponse.json(
      { error: 'Supabase is not configured on the server.' },
      { status: 503 }
    );

  const body = (await req.json()) as Record<string, unknown>;
  const id = String(body.id ?? '');
  if (!id) return badRequest('id is required');

  const parsed = parseBody(body);
  if (!parsed.ok) return badRequest(parsed.error);

  const { data, error } = await db
    .from('projects')
    .update(parsed.row)
    .eq('id', id)
    .select()
    .single();

  if (error) return dbError(error);
  return NextResponse.json({ project: data });
}

export async function DELETE(req: NextRequest) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  const db = supabaseAdmin();
  if (!db)
    return NextResponse.json(
      { error: 'Supabase is not configured on the server.' },
      { status: 503 }
    );

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return badRequest('id is required');

  const { error } = await db.from('projects').delete().eq('id', id);
  if (error) return dbError(error);
  return NextResponse.json({ ok: true });
}
