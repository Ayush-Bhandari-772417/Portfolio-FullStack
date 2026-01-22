// frontend2\src\components\CreationDetailClient.tsx
'use client';
import { Creation, AllSettings } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Book, ArrowLeft, Clock, MapPin, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/data';
import { useCallback, useState } from 'react';
import ContentProcessor from '@/components/ContentProcessor';
import TableOfContents from '@/components/TableOfContents';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface CreationDetailClientProps {
  creation: Creation;
  relatedCreations: Creation[];
  settings: AllSettings;
  categoryName?: string | null;
}

export default function CreationDetailClient({ 
  creation, 
  relatedCreations, 
  settings,
  categoryName 
}: CreationDetailClientProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  
  const typeColors = {
    blog: 'from-blue-500 to-cyan-500',
    poem: 'from-purple-500 to-pink-500',
    story: 'from-orange-500 to-red-500',
    article: 'from-green-500 to-emerald-500',
  };
  
  const publishDate = creation.published_date || creation.written_date;
  const postedDate = creation.posted_date;
  const updatedDate = creation.updated_date;

  // Get related creations limit from settings
  const relatedLimit = settings.display?.detail?.[creation.type]?.limit || 3;
  const displayedRelated = relatedCreations.slice(0, relatedLimit);

  // Handle headings extracted from ContentProcessor
  const handleHeadingsExtracted = useCallback((extractedHeadings: Heading[]) => {
    setHeadings(extractedHeadings);
    if (extractedHeadings.length > 0 && !activeId) {
      setActiveId(extractedHeadings[0].id);
    }
  }, [activeId]);

  // Handle active heading change from scroll
  const handleActiveHeadingChange = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  // Handle TOC click - smooth scroll to heading
  const handleTOCClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setActiveId(id);
      
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarHeight - 20;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <article className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link 
              href={`/creations/${creation.type}`}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to {creation.type}s
            </Link>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className={`px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${typeColors[creation.type]} text-white shadow-lg`}>
                {creation.type.charAt(0).toUpperCase() + creation.type.slice(1)}
              </span>
              {categoryName && (
                <span className="px-4 py-1 rounded-full text-sm font-semibold bg-blue-500 text-white shadow-lg">
                  {categoryName}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{creation.title}</h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">{creation.excerpt}</p>

            <div className="flex flex-wrap gap-4 text-sm items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Written: {formatDate(creation.written_date)}</span>
              </div>
              
              {creation.published_date && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Published: {formatDate(creation.published_date)}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Posted: {formatDate(postedDate)}</span>
              </div>

              {updatedDate !== postedDate && (
                <div className="flex items-center gap-2 text-amber-300">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {formatDate(updatedDate)}</span>
                </div>
              )}
              
              {creation.published_in && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{creation.published_in}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Table of Contents */}
          <aside className="lg:col-span-3">
            <TableOfContents 
              headings={headings} 
              activeId={activeId} 
              onHeadingClick={handleTOCClick} 
            />
          </aside>

          {/* Center: Content */}
          <main className="lg:col-span-6">
            {creation.featured_image_url && (
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-8 group">
                <Image
                  src={creation.featured_image_url}
                  alt={creation.featured_image_alt || creation.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              </div>
            )}

            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-8 border border-slate-200">
              {creation.content_html ? (
                <ContentProcessor 
                  htmlContent={creation.content_html} 
                  onHeadingsExtracted={handleHeadingsExtracted} 
                  onActiveHeadingChange={handleActiveHeadingChange} 
                />
              ) : (
                <p className="text-slate-600 italic">Content not available</p>
              )}
            </div>
          </main>
          
          {/* Right: Related Creations */}
          <aside className="lg:col-span-3">
            {displayedRelated.length > 0 && (
              <div className="lg:sticky lg:top-24 bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Book className="w-5 h-5 text-purple-600" />
                  Related {creation.type}s
                </h3>
                <div className="space-y-3">
                  {displayedRelated.map((related) => (
                    <Link
                      key={related.id}
                      href={`/creations/${related.type}/${related.slug}`}
                      className="block group"
                    >
                      <div className="p-3 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-blue-200 hover:shadow-md">
                        <div className="flex gap-3">
                          {related.featured_image_url && (
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                              <Image
                                src={related.featured_image_url}
                                alt={related.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm mb-1">
                              {related.title}
                            </h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(related.published_date || related.written_date)}
                            </p>
                            <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${typeColors[related.type]} text-white`}>
                              {related.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link 
                  href={`/creations/${creation.type}`} 
                  className="block mt-4 text-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
                >
                  View All {creation.type}s →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </article>
  );
}