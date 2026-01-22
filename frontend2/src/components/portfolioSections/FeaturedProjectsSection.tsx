// frontend2\src\components\portfolioSections\FeaturedProjectsSection.tsx
import { AllSettings } from '@/types';
import { getProjects, getDisplayLimit } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function FeaturedProjectsSection({ settings }: { settings: AllSettings }) {
  const limit = getDisplayLimit(settings, 'home', 'projects', 3);
  const projects = await getProjects({ featured: true, limit });

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Projects</span>
            </h2>
            <p className="text-xl text-slate-600">Showcasing my best work</p>
          </div>
          
          <Link
            href="/projects"
            className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all"
          >
            View All
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} featured />
          ))}
        </div>

        <div className="text-center md:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all"
          >
            View All Projects
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
