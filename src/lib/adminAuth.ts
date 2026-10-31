import 'server-only';
import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Failed-login tracking per client IP. In-memory, so on serverless hosts each
// instance counts separately - it slows guessing down but is not a hard limit.
const failures = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    // Still do a comparison so timing doesn't depend on where lengths differ.
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

/**
 * Returns null when the request carries the right admin password, otherwise
 * the error response to send back (401, or 429 once an IP is locked out).
 */
export function checkAdmin(req: NextRequest): NextResponse | null {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ip = clientIp(req);
  const now = Date.now();
  const entry = failures.get(ip);
  if (entry && entry.resetAt <= now) failures.delete(ip);

  const current = failures.get(ip);
  if (current && current.count >= MAX_FAILURES) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((current.resetAt - now) / 1000))
        }
      }
    );
  }

  const provided = req.headers.get('x-admin-password') ?? '';
  if (safeEqual(provided, expected)) {
    failures.delete(ip);
    return null;
  }

  failures.set(ip, {
    count: (current?.count ?? 0) + 1,
    resetAt: current?.resetAt ?? now + WINDOW_MS
  });
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function dbError(error: { message: string }) {
  console.error('[admin api]', error.message);
  return NextResponse.json({ error: 'Request failed.' }, { status: 500 });
}
