'use client';
import { useEffect, useState } from 'react';
import ProjectsAdmin from '@/components/admin/ProjectsAdmin';
import PhotosAdmin from '@/components/admin/PhotosAdmin';

const inputCls =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-[var(--fg-soft)]';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [status, setStatus] = useState('');
  const [tab, setTab] = useState<'projects' | 'photos'>('projects');

  // The site hides the native cursor globally for its custom cursor, which
  // isn't rendered here - restore the native cursor while on /admin.
  useEffect(() => {
    document.documentElement.classList.add('native-cursor');
    return () => {
      document.documentElement.classList.remove('native-cursor');
    };
  }, []);

  async function verify() {
    // A write-less check: POST with an empty body returns 400 if the password
    // is right (validation error) or 401 if it's wrong.
    setStatus('');
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-admin-password': password
      },
      body: JSON.stringify({})
    });
    if (res.status === 401) {
      setStatus('Wrong password.');
      return;
    }
    if (res.status === 503) {
      setStatus('Supabase is not configured on the server yet.');
      return;
    }
    setAuthed(true);
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6 text-[var(--fg)]">
        <h1 className="font-display text-3xl">Admin</h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Enter the admin password to manage projects and photos.
        </p>
        <input
          type="password"
          className={inputCls}
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && verify()}
        />
        <button
          onClick={verify}
          className="rounded-lg bg-[var(--fg)] px-4 py-2 text-sm font-medium text-[var(--bg)]"
        >
          Unlock
        </button>
        {status && <p className="text-sm text-rose-400">{status}</p>}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-[var(--fg)]">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-4xl">Studio</h1>
        <a
          href="/"
          className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]"
        >
          ← back to site
        </a>
      </div>

      <div className="mb-8 inline-flex rounded-lg border border-[var(--border)] p-1">
        {(['projects', 'photos'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-sm capitalize transition-colors ${
              tab === t
                ? 'bg-[var(--fg)] text-[var(--bg)]'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'projects' ? (
        <ProjectsAdmin password={password} />
      ) : (
        <PhotosAdmin password={password} />
      )}
    </main>
  );
}
