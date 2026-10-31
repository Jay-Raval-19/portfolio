import { redirect } from 'next/navigation';

// The projects grid lives on the home page; keep /projects as a friendly alias.
export default function ProjectsIndex() {
  redirect('/#projects');
}
