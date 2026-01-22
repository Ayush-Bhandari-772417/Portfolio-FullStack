// frontend2\src\components\ProjectDetailClient.tsx
'use client';

import { Project, AllSettings, ProjectGalleryImage } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Github, ExternalLink, Tag, Users, ArrowLeft, Sparkles, Layers, Clock, CheckCircle, PauseCircle } from 'lucide-react';
import TechBadge from './TechBadge';
import { useState, useEffect } from 'react';

interface ProjectDetailClientProps {
  project: Project;
  settings: AllSettings;
  relatedProjects: Project[];
}

export default function ProjectDetailClient({ project, settings, relatedProjects }: ProjectDetailClientProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startedYear = new Date(project.started_date).getFullYear();
  const completedYear = project.completed_date ? new Date(project.completed_date).getFullYear() : null;

  const statusConfig = {
    completed: { color: 'bg-emerald-500', text: 'Completed', icon: CheckCircle },
    ongoing: { color: 'bg-blue-500', text: 'In Progress', icon: Clock },
    planned: { color: 'bg-amber-500', text: 'Planned', icon: Sparkles },
    paused: { color: 'bg-orange-500', text: 'Paused', icon: PauseCircle },
  } as const;

  const status = statusConfig[project.status] ?? statusConfig.ongoing;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden pt-16 md:pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Link 
              href="/projects"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 sm:mb-8 group backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base">Back to projects</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
              <span className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white ${status.color} shadow-lg backdrop-blur-sm flex items-center gap-1.5`}>
                <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                {status.text}
              </span>
              <span className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-white/20 backdrop-blur-sm">
                {project.project_type.charAt(0).toUpperCase() + project.project_type.slice(1)}
              </span>
              {project.featured && (
                <span className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  Featured
                </span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight text-white drop-shadow-lg">
              {project.title}
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-6 sm:mb-10 leading-relaxed max-w-3xl drop-shadow">
              {project.excerpt}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-white/90">
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 sm:px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">{startedYear}{completedYear && ` - ${completedYear}`}</span>
              </div>
              {project.contributors.length > 0 && (
                <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 sm:px-4 py-2 rounded-full">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">{project.contributors.length} {project.contributors.length > 1 ? 'Contributors' : 'Contributor'}</span>
                </div>
              )}
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 sm:px-4 py-2 rounded-full">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">{project.technologies.length} Technologies</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 sm:h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="rgb(248 250 252)"/>
          </svg>
        </div>
      </div>

      {/* Action Buttons - Mobile Inline (not fixed) */}
      <div className="lg:hidden container mx-auto px-4 sm:px-6 mt-6">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200 space-y-3">
          {project.live_link && (
            <a
              href={project.live_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-xl transition-all text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demo</span>
            </a>
          )}
          {project.repository_link && (
            <a
              href={project.repository_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all text-sm"
            >
              <Github className="w-4 h-4" />
              <span>View Source Code</span>
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 -mt-4 sm:-mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Main Content - 8 columns */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              {/* Featured Image with Overlay */}
              {project.featured_image_url && (
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                  <Image
                    src={project.featured_image_url}
                    alt={project.featured_image_alt || project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 text-white">
                    <p className="text-xs sm:text-sm font-semibold opacity-90 flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Project Showcase
                    </p>
                  </div>
                </div>
              )}

              {/* Abstract with Icon */}
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-blue-100">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="p-2.5 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex-shrink-0">
                    <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Project Overview</h2>
                </div>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">{project.abstract}</p>
              </div>

              {/* Features with Enhanced Design */}
              {project.features.length > 0 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-slate-200">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 flex items-center gap-3">
                    <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                    Key Features
                  </h2>
                  <div className="grid gap-3 sm:gap-4">
                    {project.features.map((feature, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-slate-50 transition-all group"
                      >
                        <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md group-hover:scale-110 transition-transform">
                          {index + 1}
                        </span>
                        <span className="text-slate-700 text-base sm:text-lg leading-relaxed pt-0.5">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery with Proper Captions */}
              {project.gallery_images && project.gallery_images.length > 0 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-slate-200">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 flex items-center gap-3">
                    <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                    Project Gallery
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {project.gallery_images
                      .sort((a, b) => a.order - b.order)
                      .map((galleryImage: ProjectGalleryImage) => (
                        <div 
                          key={galleryImage.id} 
                          className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                          <div className="relative aspect-video sm:aspect-[4/3] overflow-hidden bg-slate-100">
                            <Image
                              src={galleryImage.image}
                              alt={galleryImage.caption || `Gallery image ${galleryImage.order}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              unoptimized
                            />
                            {galleryImage.caption && (
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white text-sm sm:text-base font-medium leading-snug">
                                  {galleryImage.caption}
                                </p>
                              </div>
                            )}
                          </div>
                          {!galleryImage.caption && (
                            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                              {galleryImage.order}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Client Feedback */}
              {project.client_feedback && (
                <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl text-white overflow-hidden">
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-white/20 text-6xl sm:text-9xl font-serif leading-none">"</div>
                  <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Client Feedback</h2>
                    <p className="text-base sm:text-xl leading-relaxed italic pl-4 sm:pl-8">{project.client_feedback}</p>
                  </div>
                  <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-white/20 text-6xl sm:text-9xl font-serif leading-none rotate-180">"</div>
                </div>
              )}
            </div>

            {/* Enhanced Sidebar - 4 columns */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Action Buttons - Desktop Sticky with proper z-index */}
              <div className="hidden lg:block lg:sticky lg:top-24 bg-white rounded-2xl p-6 shadow-lg border border-slate-200 space-y-3 z-10">
                {project.live_link && (
                  <a
                    href={project.live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Live Demo
                  </a>
                )}
                {project.repository_link && (
                  <a
                    href={project.repository_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all transform hover:-translate-y-1"
                  >
                    <Github className="w-5 h-5" />
                    Source Code
                  </a>
                )}
              </div>

              {/* Technologies */}
              {project.technologies.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-600" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-blue-50 text-slate-700 rounded-lg text-sm font-medium hover:from-slate-200 hover:to-blue-100 transition-colors border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contributors */}
              {project.contributors.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Team
                  </h3>
                  <ul className="space-y-2">
                    {project.contributors.map((contributor, index) => (
                      <li key={index} className="text-slate-700 pl-4 border-l-3 border-blue-300 py-1 hover:border-blue-500 hover:bg-blue-50 transition-all rounded-r">
                        {contributor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Projects - Shows on ALL screen sizes */}
              {relatedProjects.length > 0 && (
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border-2 border-purple-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-600" />
                    More Projects
                  </h3>
                  <div className="space-y-3">
                    {relatedProjects.map((relatedProject) => (
                      <Link
                        key={relatedProject.id}
                        href={`/projects/${relatedProject.slug}`}
                        className="block group"
                      >
                        <div className="p-4 rounded-xl hover:bg-white transition-all border border-transparent hover:border-purple-200 hover:shadow-md">
                          <div className="flex gap-3">
                            {relatedProject.featured_image_url && (
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                <Image
                                  src={relatedProject.featured_image_url}
                                  alt={relatedProject.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  unoptimized
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2 text-sm mb-1">
                                {relatedProject.title}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                                {relatedProject.excerpt}
                              </p>
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                relatedProject.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                relatedProject.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                                relatedProject.status === 'paused' ? 'bg-orange-100 text-orange-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {statusConfig[relatedProject.status]?.text ?? relatedProject.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link 
                    href="/projects" 
                    className="block mt-4 text-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-700 rounded-lg transition-colors text-sm font-semibold"
                  >
                    View All Projects →
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}