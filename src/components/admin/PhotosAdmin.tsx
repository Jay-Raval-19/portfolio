'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { ASPECT_OPTIONS, Photo } from '@/lib/photoMeta';
import { getCroppedBlob } from '@/lib/cropImage';

// Parse an aspect string like '4/5' into a numeric ratio.
function aspectRatio(aspect: string): number {
  const [w, h] = aspect.split('/').map(Number);
  return w && h ? w / h : 4 / 5;
}

// Build a centered starting crop for the given aspect ('free' = 90% box).
function makeInitialCrop(
  aspect: string,
  imgW: number,
  imgH: number
): Crop {
  if (aspect === 'free') {
    return centerCrop(
      { unit: '%', width: 90, height: 90, x: 0, y: 0 },
      imgW,
      imgH
    );
  }
  return centerCrop(
    makeAspectCrop(
      { unit: '%', width: 90 },
      aspectRatio(aspect),
      imgW,
      imgH
    ),
    imgW,
    imgH
  );
}

type FormState = {
  id?: string;
  caption: string;
  location: string;
  date: string;
  aspect: string;
  sort_order: string;
  old_image_path?: string;
};

const EMPTY: FormState = {
  caption: '',
  location: '',
  date: '',
  aspect: '4/5',
  sort_order: '0'
};

const inputCls =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-[var(--fg-soft)]';
const labelCls =
  'mb-1 block font-mono text-[0.65rem] uppercase tracking-wider text-[var(--fg-muted)]';

export default function PhotosAdmin({ password }: { password: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Cropper state (only used while a freshly-picked file is being framed).
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  // Actual cropped ratio (e.g. '1600/1200'), stored so the frame always fits.
  const [uploadAspect, setUploadAspect] = useState('');

  // Build (and clean up) an object URL to preview the selected file locally.
  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    setCrop(undefined);
    setCompletedCrop(null);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Seed a centered crop once the image has loaded (or when aspect changes).
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(makeInitialCrop(form.aspect, width, height));
  }

  // Regenerate the cropped blob + preview + ratio whenever framing finishes.
  useEffect(() => {
    if (!completedCrop?.width || !completedCrop?.height || !imgRef.current)
      return;
    let cancelled = false;
    getCroppedBlob(imgRef.current, completedCrop)
      .then(({ blob, width, height }) => {
        if (cancelled) return;
        setCroppedBlob(blob);
        setUploadAspect(`${width}/${height}`);
        setCroppedPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [completedCrop]);

  // When the aspect dropdown changes mid-crop, re-seed the crop box.
  function changeAspect(next: string) {
    set('aspect', next);
    const img = imgRef.current;
    if (img) setCrop(makeInitialCrop(next, img.width, img.height));
  }

  // Darkroom preview shows the cropped result, else the existing image (edit).
  const previewSrc = croppedPreview ?? filePreview ?? (editingUrl || null);
  // Aspect for the preview frame: real crop ratio, else the chosen ratio.
  const previewAspect =
    uploadAspect || (form.aspect === 'free' ? '4/5' : form.aspect);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/photos', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setPhotos(json.photos);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Failed to load');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function reset() {
    setForm(EMPTY);
    setFile(null);
    setEditingUrl('');
    setCroppedBlob(null);
    setUploadAspect('');
    setCroppedPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setCrop(undefined);
    setCompletedCrop(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  function editPhoto(p: Photo) {
    setForm({
      id: p.id,
      caption: p.caption,
      location: p.location,
      date: p.date,
      aspect: p.aspect,
      sort_order: String(p.sort_order ?? 0),
      old_image_path: p.image_path
    });
    setFile(null);
    setEditingUrl(p.image_url);
    if (fileRef.current) fileRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id && !file) {
      setStatus('Choose an image file.');
      return;
    }
    setLoading(true);
    setStatus('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined) fd.append(k, String(v));
      });
      // Upload the cropped result when a new file was picked; fall back to raw.
      if (croppedBlob && file) {
        const base = file.name.replace(/\.[^.]+$/, '');
        fd.append('file', new File([croppedBlob], `${base}.jpg`, {
          type: 'image/jpeg'
        }));
        // Store the real cropped ratio so the gallery frame fits exactly.
        if (uploadAspect) fd.set('aspect', uploadAspect);
      } else if (file) {
        fd.append('file', file);
      }

      const res = await fetch('/api/photos', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'x-admin-password': password },
        body: fd
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setStatus(form.id ? 'Updated ✓' : 'Uploaded ✓');
      reset();
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id?: string) {
    if (!id || !confirm('Delete this photo?')) return;
    const res = await fetch(`/api/photos?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password }
    });
    const json = await res.json();
    if (!res.ok) {
      setStatus(json.error || 'Delete failed');
      return;
    }
    setStatus('Deleted ✓');
    load();
  }

  return (
    <>
      <form
        onSubmit={save}
        className="mb-12 grid grid-cols-1 gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className={labelCls}>
            Image file {form.id ? '(leave empty to keep current)' : '*'}
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={`${inputCls} file:mr-3 file:rounded file:border-0 file:bg-[var(--fg)] file:px-3 file:py-1 file:text-[var(--bg)]`}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Crop & frame - only while a freshly-picked file is being framed */}
        {filePreview && (
          <div className="sm:col-span-2">
            <label className={labelCls}>
              Crop & frame - drag the handles to resize ·{' '}
              {form.aspect === 'free'
                ? 'freeform (any shape)'
                : `locked to ${form.aspect}`}
            </label>
            <div className="flex justify-center rounded-lg border border-[var(--border)] bg-black p-3">
              <ReactCrop
                crop={crop}
                onChange={(_px, percent) => setCrop(percent)}
                onComplete={(px) => setCompletedCrop(px)}
                aspect={
                  form.aspect === 'free' ? undefined : aspectRatio(form.aspect)
                }
                keepSelection
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={filePreview}
                  alt="to crop"
                  onLoad={onImageLoad}
                  style={{ maxHeight: 360, width: 'auto' }}
                />
              </ReactCrop>
            </div>
          </div>
        )}

        {/* Live darkroom preview - updates with file, aspect & caption */}
        <div className="sm:col-span-2">
          <label className={labelCls}>Darkroom preview</label>
          <div className="rounded-lg border border-[var(--border)] bg-[#0a0908] p-6">
            <figure className="mx-auto max-w-[240px]">
              <div
                className="group relative overflow-hidden bg-[#15120f] ring-1 ring-[#2a2724]"
                style={{ aspectRatio: previewAspect || '4/5' }}
              >
                {previewSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewSrc}
                    alt="preview"
                    className="absolute inset-0 h-full w-full object-cover opacity-90"
                  />
                ) : (
                  <>
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(135deg, #1a1714 0%, #0f0d0b 40%, #1c1815 100%)'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[#5a544c]">
                      no image
                    </div>
                  </>
                )}
                <div className="absolute left-3 top-3 font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[#8a837a]">
                  {String(Number(form.sort_order) || photos.length + 1).padStart(
                    2,
                    '0'
                  )}{' '}
                  / {photos.length + (form.id ? 0 : 1)}
                </div>
                <div className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-[#aa4a3a]" />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate font-display text-lg italic text-[#e8e4dc]">
                    {form.caption || 'your caption'}
                  </div>
                  <div className="mt-1 truncate font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[#8a837a]">
                    {form.location || 'location'} · {form.date || 'year'}
                  </div>
                </div>
                <div className="shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[#8a837a]">
                  no.{' '}
                  {String(
                    Number(form.sort_order) || photos.length + 1
                  ).padStart(2, '0')}
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Caption</label>
          <input
            className={inputCls}
            value={form.caption}
            onChange={(e) => set('caption', e.target.value)}
            placeholder="first light through the window"
          />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input
            className={inputCls}
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="ahmedabad"
          />
        </div>
        <div>
          <label className={labelCls}>Date</label>
          <input
            className={inputCls}
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            placeholder="2025"
          />
        </div>
        <div>
          <label className={labelCls}>Aspect ratio</label>
          <select
            className={inputCls}
            value={
              ['free', ...ASPECT_OPTIONS].includes(form.aspect)
                ? form.aspect
                : 'custom'
            }
            onChange={(e) => changeAspect(e.target.value)}
          >
            <option value="free">free (any shape)</option>
            {ASPECT_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
            {!['free', ...ASPECT_OPTIONS].includes(form.aspect) && (
              <option value="custom">custom ({form.aspect})</option>
            )}
          </select>
        </div>
        <div>
          <label className={labelCls}>Sort order</label>
          <input
            type="number"
            className={inputCls}
            value={form.sort_order}
            onChange={(e) => set('sort_order', e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[var(--fg)] px-5 py-2 text-sm font-medium text-[var(--bg)] disabled:opacity-50"
          >
            {loading
              ? 'Working…'
              : form.id
                ? 'Update photo'
                : 'Upload photo'}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={reset}
              className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]"
            >
              Cancel edit
            </button>
          )}
          {status && (
            <span className="text-sm text-[var(--fg-muted)]">{status}</span>
          )}
        </div>
      </form>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((p) => (
          <li
            key={p.id}
            className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]"
          >
            <div
              className="relative w-full bg-black/40"
              style={{ aspectRatio: p.aspect || '4/5' }}
            >
              {p.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image_url}
                  alt={p.caption}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-medium">
                {p.caption || 'untitled'}
              </p>
              <p className="truncate font-mono text-[0.6rem] uppercase tracking-wider text-[var(--fg-muted)]">
                {p.location} · {p.date} · #{p.sort_order ?? 0}
              </p>
              <div className="mt-2 flex gap-3 text-xs">
                <button
                  onClick={() => editPhoto(p)}
                  className="text-[var(--fg-muted)] hover:text-[var(--fg)]"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="text-rose-400 hover:text-rose-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
        {photos.length === 0 && (
          <li className="col-span-full text-sm text-[var(--fg-muted)]">
            No photos yet - upload your first frame above.
          </li>
        )}
      </ul>
    </>
  );
}
