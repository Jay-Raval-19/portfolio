import { redirect } from 'next/navigation';

// The projects grid lives on the home page; keep /projects as a friendly alias.
// Re-fetch Supabase content at most once a minute so admin edits show without a redeploy.
export const revalidate = 60;

export default function ProjectsIndex() {
  redirect('/#projects');
}
