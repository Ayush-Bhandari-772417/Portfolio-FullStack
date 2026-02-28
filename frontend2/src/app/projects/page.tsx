// frontend2\src\app\projects\page.tsx
import { Metadata } from 'next';
import { getProjects, getSettings, getCategories, getSEORobots } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';
import PageHeader from '@/components/PageHeader';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  const pageTitle = settings.settings.projects_page_title || 'Projects';
  const pageDescription = settings.settings.projects_page_description || 
    'Explore my portfolio of web development projects, applications, and technical solutions.';
  const ogImage = settings.settings.projects_og_image || '/logo.png';
  const robots = getSEORobots(settings, 'projects');

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: settings.settings.projects_page_keywords || 'projects, portfolio, web development, applications',
    alternates: { 
      canonical: `${baseUrl}/projects` 
    },
    openGraph: {
      type: 'website',
      url: `${baseUrl}/projects`,
      title: settings.settings.projects_og_title || pageTitle,
      description: settings.settings.projects_og_description || pageDescription,
      images: [{ 
        url: ogImage, 
        width: 1200, 
        height: 630, 
        alt: 'Projects Portfolio' 
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.settings.projects_twitter_title || pageTitle,
      description: settings.settings.projects_twitter_description || pageDescription,
      images: [ogImage],
    },
    robots,
  };
}

export default async function ProjectsPage() {
  const [projects, settings, categories] = await Promise.all([
    getProjects(),
    getSettings(),
    getCategories(),
  ]);

  const featuredProjects = projects.filter(p => p.featured);
  const regularProjects = projects.filter(p => !p.featured);

  return (
    <>
      <script
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