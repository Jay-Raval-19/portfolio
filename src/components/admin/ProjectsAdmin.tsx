'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  PATTERN_OPTIONS,
  Project,
  SIZE_OPTIONS,
  THEME_OPTIONS
} from '@/lib/projectMeta';

type FormState = {
  id?: string;
  title: string;
  kicker: string;
  description: string;
  tags: string; // comma-separated in the form
  date: string;
  theme: string;
  pattern: string;
  size: string;
  sort_order: string;
};

const EMPTY: FormState = {
  title: '',
  kicker: '',
  description: '',
  tags: '',
  date: '',
  theme: 'blue',
  pattern: 'grid',
  size: 'medium',
  sort_order: '0'
};

const inputCls =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-[var(--fg-soft)]';
const labelCls =
  'mb-1 block font-mono text-[0.65rem] uppercase tracking-wider text-[var(--fg-muted)]';

export default function ProjectsAdmin({ password }: { password: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setProjects(json.projects);
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

  function editProject(p: Project) {
    setForm({
      id: p.id,
      title: p.title,
      kicker: p.kicker,
      description: p.description,
      tags: p.tags.join(', '),
      date: p.date,
      theme: p.theme,
      pattern: p.pattern,
      size: p.size,
      sort_order: String(p.sort_order ?? 0)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const method = form.id ? 'PUT' : 'POST';
      const res = await fetch('/api/projects', {
        method,
        headers: {
          'content-type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags,
          sort_order: Number(form.sort_order)
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setStatus(form.id ? 'Updated ✓' : 'Added ✓');
      setForm(EMPTY);
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id?: string) {
    if (!id || !confirm('Delete this project?')) return;
    const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
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
          <label className={labelCls}>Title *</label>
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Kicker (e.g. side project)</label>
          <input
            className={inputCls}
            value={form.kicker}
            onChange={(e) => set('kicker', e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Date</label>
          <input
            className={inputCls}
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            placeholder="Jan – Apr 2025"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea
            className={`${inputCls} min-h-[80px]`}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Tags (comma-separated)</label>
          <input
            className={inputCls}
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            placeholder="React, Go, Docker"
          />
        </div>
        <div>
          <label className={labelCls}>Theme (color)</label>
          <select
            className={inputCls}
            value={form.theme}
            onChange={(e) => set('theme', e.target.value)}
          >
            {THEME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Pattern</label>
          <select
            className={inputCls}
            value={form.pattern}
            onChange={(e) => set('pattern', e.target.value)}
          >
            {PATTERN_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Size (card span)</label>
          <select
            className={inputCls}
            value={form.size}
            onChange={(e) => set('size', e.target.value)}
          >
            {SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
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
            {form.id ? 'Update project' : 'Add project'}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(EMPTY)}
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

      <ul className="space-y-3">
        {projects.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{p.title}</p>
              <p className="truncate font-mono text-[0.65rem] uppercase tracking-wider text-[var(--fg-muted)]">
                {p.kicker} · {p.theme} · {p.size} · #{p.sort_order ?? 0}
              </p>
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              <button
                onClick={() => editProject(p)}
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
          </li>
        ))}
        {projects.length === 0 && (
          <li className="text-sm text-[var(--fg-muted)]">
            No projects yet - add your first one above.
          </li>
        )}
      </ul>
    </>
  );
}
