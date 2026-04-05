// frontend2\src\app\projects\page.tsx
import { Metadata } from 'next';
import { getProjects, getBootstrap, getSEORobots } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';
import PageHeader from '@/components/PageHeader';
import { normalizeSettingsFromBootstrap } from '@/lib/normalizeSettings';
import { buildMetadata } from '@/lib/seo/metadata';
import { projectListJsonLd } from '@/lib/seo/jsonld';
import { websiteJsonLd } from '@/lib/seo/website';
import { breadcrumbsJsonLd } from '@/lib/seo/breadcrumbs';
import { speakableJsonLd } from '@/lib/seo/speakable';

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const bootstrap = await getBootstrap();
  const settings = normalizeSettingsFromBootstrap(bootstrap);

  return buildMetadata({
    settings: settings,
    page: "creation-list-page",
    title: settings.settings.projects_page_title || 'Projects',
    description: settings.settings.projects_page_description || 
    'Explore my portfolio of web development projects, applications, and technical solutions.',
    path: `/projects`,
    image: settings.settings.projects_og_image || '/logo.png',
    keywords: settings.settings.projects_page_keywords || 'projects, portfolio, web development, applications',
  });
}

export default async function ProjectsPage() {
  const bootstrap = await getBootstrap();
  const [projects, settings] = await Promise.all([
    getProjects(),
    normalizeSettingsFromBootstrap(bootstrap)
  ]);

  const featuredProjects = projects.filter(p => p.featured);
  const regularProjects = projects.filter(p => !p.featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            projectListJsonLd(),
            websiteJsonLd(),
            breadcrumbsJsonLd([]),
            speakableJsonLd(),
          ]),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <PageHeader
          title="My Projects"
          subtitle="Explore my portfolio of web applications, tools, and technical solutions"
          gradient="from-blue-600 via-purple-600 to-pink-600"
        />

        <section className="container mx-auto px-6 py-16">
          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></span>
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} featured />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
              All Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>

          {projects.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
                <p className="text-xl text-slate-600">No projects found</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

// export async function generateMetadata(): Promise<Metadata> {
//   const bootstrap = await getBootstrap();
//   const settings = normalizeSettingsFromBootstrap(bootstrap);
  
//   const pageTitle = settings.settings.projects_page_title || 'Projects';
//   const pageDescription = settings.settings.projects_page_description || 
//     'Explore my portfolio of web development projects, applications, and technical solutions.';
//   const ogImage = settings.settings.projects_og_image || '/logo.png';
//   const robots = getSEORobots(settings, 'projects');

//   return {
//     title: pageTitle,
//     description: pageDescription,
//     keywords: settings.settings.projects_page_keywords || 'projects, portfolio, web development, applications',
//     alternates: { 
//       canonical: `${baseUrl}/projects` 
//     },
//     openGraph: {
//       type: 'website',
//       url: `${baseUrl}/projects`,
//       title: settings.settings.projects_og_title || pageTitle,
//       description: settings.settings.projects_og_description || pageDescription,
//       images: [{ 
//         url: ogImage, 
//         width: 1200, 
//         height: 630, 
//         alt: 'Projects Portfolio' 
//       }],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: settings.settings.projects_twitter_title || pageTitle,
//       description: settings.settings.projects_twitter_description || pageDescription,
//       images: [ogImage],
//     },
//     robots,
//   };
// }    

      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Projects Portfolio',
            description: 'Collection of web development projects and applications',
            url: `${baseUrl}/projects`,
          }),
        }}
      /> */}