// frontend2\src\app\projects\page.tsx
import { Metadata } from 'next';
import { getProjects, getBootstrap, getDisplayLimit } from '@/lib/data';
import ProjectCard from '@/components/cards/ProjectCard';
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

  const featuredLimit = getDisplayLimit(settings, 'portfolio', 'project', 6);
  const regularLimit = getDisplayLimit(settings, 'portfolio', 'project', 12);
  const featuredProjects = projects.filter(p => p.featured).slice(0, featuredLimit);
  const regularProjects = projects.filter(p => !p.featured).slice(0, regularLimit);

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