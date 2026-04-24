'use client';

import { Project } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Clock, Sparkles, PauseCircle } from 'lucide-react';

interface ProjectRecommendationCardProps {
  project: Project;
}

const statusConfig = {
  completed: { color: 'bg-emerald-100 text-emerald-700', text: 'Completed', icon: CheckCircle },
  ongoing: { color: 'bg-blue-100 text-blue-700', text: 'In Progress', icon: Clock },
  planned: { color: 'bg-amber-100 text-amber-700', text: 'Planned', icon: Sparkles },
  paused: { color: 'bg-orange-100 text-orange-700', text: 'Paused', icon: PauseCircle },
} as const;

export default function ProjectRecommendationCard({ project }: ProjectRecommendationCardProps) {
  const StatusIcon = statusConfig[project.status]?.icon ?? Clock;

  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <div className="p-4 rounded-xl hover:bg-slate-50/70 transition-all border border-slate-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50 transform hover:-translate-y-0.5 hover:scale-[1.02] duration-300 overflow-hidden bg-gradient-to-br from-white to-slate-50/50">
        <div className="flex gap-3">
          {project.featured_image_url && (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200/50 group-hover:ring-purple-300/50">
              <Image
                src={project.featured_image_url}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-400 saturate-100 group-hover:saturate-120 brightness-100 group-hover:brightness-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
          <div className="flex-1 min-w-0 py-1">
            <h4 className="font-bold text-slate-900 group-hover:text-purple-600 transition-all line-clamp-2 text-sm leading-tight mb-1.5 pr-2">
              {project.title}
            </h4>
            <p className="text-xs text-slate-500 group-hover:text-slate-600 line-clamp-2 leading-relaxed mb-2 pr-2">
              {project.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm border border-slate-200/50 ${statusConfig[project.status]?.color ?? 'bg-slate-100 text-slate-700'} transform group-hover:scale-105 group-hover:shadow-md transition-all`}>
                <StatusIcon className="w-3 h-3 flex-shrink-0" />
                {statusConfig[project.status]?.text ?? project.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
