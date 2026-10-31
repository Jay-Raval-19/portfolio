import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectDetail from '@/components/jay/ProjectDetail';
import { projectDetails, getProjectDetail } from '@/lib/projectDetails';
import { defaultProjects } from '@/lib/projectMeta';

export function generateStaticParams() {
  return Object.keys(projectDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectDetail(slug);
  if (!project) return { title: 'Project - Jay Raval' };
  return {
    title: `${project.title} - Jay Raval`,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      type: 'article'
    }
  };
}

// Re-fetch Supabase content at most once a minute so admin edits show without a redeploy.
export const revalidate = 60;

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const external = defaultProjects.find(
    (p) => p.slug === slug && p.externalUrl
  );
  if (external?.externalUrl) redirect(external.externalUrl);
  const project = getProjectDetail(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
