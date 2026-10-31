import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabasePublic } from '@/lib/supabase';
import { checkAdmin, dbError } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

const BUCKET = 'photos';
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const IMAGE_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif'
};
// Storage paths this API generates: <uuid>.<ext>
const STORAGE_PATH = /^[0-9a-f-]{36}\.[a-z0-9]{2,5}$/i;

function notConfigured() {
  return NextResponse.json(
    { error: 'Supabase is not configured on the server.' },
    { status: 503 }
  );
}

// Pull the non-file metadata fields out of a form submission.
function fieldsFrom(form: FormData) {
  return {
    caption: String(form.get('caption') ?? '').trim(),
    location: String(form.get('location') ?? '').trim(),
    date: String(form.get('date') ?? '').trim(),
    aspect: String(form.get('aspect') ?? '4/5').trim() || '4/5',
    sort_order: Number.isFinite(Number(form.get('sort_order')))
      ? Number(form.get('sort_order'))
      : 0
  };
}

// Upload a File to storage and return its public URL + path.
async function uploadFile(
  db: NonNullable<ReturnType<typeof supabaseAdmin>>,
  file: File
) {
  const ext = IMAGE_EXT[file.type];
  if (!ext) return { error: 'Only JPEG, PNG, WebP, AVIF or GIF images.' };
  if (file.size > MAX_UPLOAD_BYTES)
    return { error: 'Image is too large (15 MB max).' };

  const path = `${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await db.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false
  });
  if (error) {
    console.error('[admin api] upload failed:', error.message);
    return { error: 'Upload failed.' };
  }

  const { data } = db.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

// GET is used to populate the admin list.
export async function GET() {
  // Public data only, so use the anon client (respects RLS), not the service key.
  const db = supabasePublic();
  if (!db) return notConfigured();

  const { data, error } = await db
    .from('photos')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) return dbError(error);
  return NextResponse.json({ photos: data ?? [] });
}

export async function POST(req: NextRequest) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  const db = supabaseAdmin();
  if (!db) return notConfigured();

  const form = await req.formData();
  const fields = fieldsFrom(form);

  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0)
    return NextResponse.json(
      { error: 'An image file is required.' },
      { status: 400 }
    );

  const uploaded = await uploadFile(db, file);
  if ('error' in uploaded)
    return NextResponse.json({ error: uploaded.error }, { status: 500 });

  const { data, error } = await db
    .from('photos')
    .insert({ ...fields, image_url: uploaded.url, image_path: uploaded.path })
    .select()
    .single();

  if (error) return dbError(error);
  return NextResponse.json({ photo: data });
}

export async function PUT(req: NextRequest) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  const db = supabaseAdmin();
  if (!db) return notConfigured();

  const form = await req.formData();
  const id = String(form.get('id') ?? '');
  if (!id)
    return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const fields = fieldsFrom(form);
  const update: Record<string, unknown> = { ...fields };

  // If a new file was provided, upload it and swap out the old object.
  const file = form.get('file');
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadFile(db, file);
    if ('error' in uploaded)
      return NextResponse.json({ error: uploaded.error }, { status: 500 });
    update.image_url = uploaded.url;
    update.image_path = uploaded.path;

    const oldPath = String(form.get('old_image_path') ?? '');
    if (STORAGE_PATH.test(oldPath))
      await db.storage.from(BUCKET).remove([oldPath]);
  }

  const { data, error } = await db
    .from('photos')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) return dbError(error);
  return NextResponse.json({ photo: data });
}

export async function DELETE(req: NextRequest) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  const db = supabaseAdmin();
  if (!db) return notConfigured();

  const id = new URL(req.url).searchParams.get('id');
  if (!id)
    return NextResponse.json({ error: 'id is required' }, { status: 400 });

  // Look up the storage path so we can remove the file too.
  const { data: row } = await db
    .from('photos')
    .select('image_path')
    .eq('id', id)
    .single();

  const { error } = await db.from('photos').delete().eq('id', id);
  if (error) return dbError(error);

  if (row?.image_path)
    await db.storage.from(BUCKET).remove([row.image_path]);

  return NextResponse.json({ ok: true });
}
