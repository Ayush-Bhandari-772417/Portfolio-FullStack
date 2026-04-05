// frontend2\src\app\projects\[slug]\page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects, getBootstrap, getSEORobots, getDisplayLimit } from '@/lib/data';
import ProjectDetailClient from '@/components/ProjectDetailClient';
import { normalizeSettingsFromBootstrap } from '@/lib/normalizeSettings';
import { buildMetadata } from '@/lib/seo/metadata';
import { projectDetailJsonLd } from '@/lib/seo/jsonld';
import { websiteJsonLd } from '@/lib/seo/website';
import { breadcrumbsJsonLd } from '@/lib/seo/breadcrumbs';
import { speakableJsonLd } from '@/lib/seo/speakable';

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> { 
  const bootstrap = await getBootstrap();
  const { slug } = await params;
  console.log('Generating metadata for project detail page', slug);
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    normalizeSettingsFromBootstrap(bootstrap)
  ]);
  
  if (!project) return { title: 'Project Not Found' };

  return buildMetadata({
    settings: settings,
    page: "creation-detail-page",
    title: `${project.title} | ${settings.settings.site_name || 'Portfolio'}`,
    description: project.excerpt || project.abstract,
    path: `/projects/${project.slug}`,
    image: project.featured_image_url || settings.settings.default_og_image || '/logo.png',
    publishedTime: project.started_date,
    modifiedTime: project.updated_at,
    keywords: [...project.keywords, ...project.tags, ...project.technologies],
  });
}

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const bootstrap = await getBootstrap();
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    normalizeSettingsFromBootstrap(bootstrap)
  ]);

  if (!project) notFound();

  // Get related projects limit from settings
  const relatedLimit = getDisplayLimit(settings, 'detail', 'projects', 5);
  
  // Get related projects (different slug, prefer same type or featured)
  const allProjects = await getProjects();
  const relatedProjects = allProjects
    .filter(p => p.slug !== slug)
    .sort((a, b) => {
      // Prioritize same project type
      if (a.project_type === project.project_type && b.project_type !== project.project_type) return -1;
      if (b.project_type === project.project_type && a.project_type !== project.project_type) return 1;
      // Then featured projects
      if (a.featured && !b.featured) return -1;
      if (b.featured && !a.featured) return 1;
      // Then by date
      return new Date(b.started_date).getTime() - new Date(a.started_date).getTime();
    })
    .slice(0, relatedLimit);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            projectDetailJsonLd(project, settings.settings),
            websiteJsonLd(),
            breadcrumbsJsonLd([]),
            speakableJsonLd(),
          ]),
        }}
      />

      <ProjectDetailClient 
        project={project} 
        settings={settings}
        relatedProjects={relatedProjects}
      />
    </>
  );
}

// export async function generateMetadata(
//   { params }: { params: Promise<{ slug: string }> }
// ): Promise<Metadata> { 
//   const bootstrap = await getBootstrap();
//   const { slug } = await params;
//   console.log('Generating metadata for project detail page', slug);
//   const [project, settings] = await Promise.all([
//     getProjectBySlug(slug),
//     normalizeSettingsFromBootstrap(bootstrap)
//   ]);
  
//   if (!project) return { title: 'Project Not Found' };

//   const siteName = settings.settings.site_name || 'Portfolio';
//   const authorName = settings.settings.author_name || 'Ayush Bhandari';
//   const pageTitle = `${project.title} | ${siteName}`;
//   const pageDescription = project.excerpt || project.abstract;
//   const ogImage = project.featured_image_url || settings.settings.default_og_image || '/logo.png';
//   const robotsContent = getSEORobots(settings, 'project-detail');

//   return {
//     title: pageTitle,
//     description: pageDescription,
//     keywords: [...project.keywords, ...project.tags, ...project.technologies].join(', '),
//     authors: [{ name: authorName }],
//     robots: robotsContent,
//     alternates: { 
//       canonical: `${baseUrl}/projects/${project.slug}` 
//     },
//     openGraph: {
//       type: 'article',
//       url: `${baseUrl}/projects/${project.slug}`,
//       title: project.title,
//       description: pageDescription,
//       siteName: siteName,
//       images: [{ 
//         url: ogImage, 
//         width: 1200, 
//         height: 630, 
//         alt: project.featured_image_alt || project.title 
//       }],
//       publishedTime: project.started_date,
//       modifiedTime: project.updated_at,
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: project.title,
//       description: pageDescription,
//       images: [ogImage],
//       creator: settings.settings.twitter_handle || undefined,
//     },
//   };
// }


      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.abstract,
            image: project.featured_image_url,
            author: {
              '@type': 'Person',
              name: authorName,
            },
            dateCreated: project.started_date,
            dateModified: project.updated_at,
            keywords: [...project.keywords, ...project.tags, ...project.technologies].join(', '),
          }),
        }}
      /> */}