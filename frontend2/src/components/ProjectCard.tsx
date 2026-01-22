// frontend2\src\components\ProjectCard.tsx
'use client';

import { Project } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github, Star } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
}

export default function ProjectCard({ project, index, featured }: ProjectCardProps) {
  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
      style={{ 
        animation: 'fadeInUp 0.6s ease-out forwards',
        animationDelay: `${index * 100}ms`,
        opacity: 0
      }}
    >
      {/* Image */}
      <Link href={`/projects/${project.slug}`} className="block relative h-56 overflow-hidden">
        {project.featured_image_url ? (
          <Image
            src={project.featured_image_url}
            alt={project.featured_image_alt || project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
        )}
        {featured && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            project.status === 'completed' ? 'bg-green-100 text-green-700' :
            project.status === 'ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {project.status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
            {project.project_type}
          </span>
        </div>

        <Link href={`/projects/${project.slug}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
            {project.title}
          </h3>
        </Link>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {project.excerpt}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, i) => (
            <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all text-center"
          >
            View Details
          </Link>
          {project.live_link && (
            <a
              href={project.live_link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
              title="View Live"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          {project.repository_link && (
            <a
              href={project.repository_link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border-2 border-slate-200 rounded-lg hover:border-slate-400 transition-colors"
              title="View Code"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
