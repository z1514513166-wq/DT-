import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/pages-repo';
import LandingPage from '@/components/landing/landing-page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <LandingPage content={page.content} slug={page.slug} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return { title: 'Page Not Found' };
  }

  return {
    title: page.title,
    description: page.description || `Learn more about ${page.title}`,
  };
}
