// frontend2\src\components\portfolioSections\CreationsPreviewSection.tsx
import { AllSettings } from '@/types';
import { getCreations, getDisplayLimit } from '@/lib/data';
import CreationCard from '@/components/CreationCard';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, FileText, Newspaper } from 'lucide-react';

export default async function CreationsPreviewSection({ settings }: { settings: AllSettings }) {
  const limit = getDisplayLimit(settings, 'home', 'creations', 2);

  const [blogs, poems, stories, articles] = await Promise.all([
    getCreations({ type: 'blog', limit }),
    getCreations({ type: 'poem', limit }),
    getCreations({ type: 'story', limit }),
    getCreations({ type: 'article', limit }),
  ]);

  const allCreations = [...blogs, ...poems, ...stories, ...articles];

  if (allCreations.length === 0) return null;

  const sections = [
    { type: 'blog', label: 'Blog Posts', items: blogs, icon: Newspaper, color: 'from-blue-500 to-cyan-500' },
    { type: 'poem', label: 'Poems', items: poems, icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { type: 'story', label: 'Stories', items: stories, icon: BookOpen, color: 'from-orange-500 to-red-500' },
    { type: 'article', label: 'Articles', items: articles, icon: FileText, color: 'from-green-500 to-emerald-500' },
  ].filter(section => section.items.length > 0);

  return (
    <section id="creations" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Creations</span>
            </h2>
            <p className="text-xl text-slate-600">Creative writings and thoughts</p>
          </div>
          
          <Link
            href="/creations"
            className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all"
          >
            View All
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="space-y-16">
          {sections.map(({ type, label, items, icon: Icon, color }) => (
            <div key={type}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Icon className={`w-7 h-7 text-transparent bg-clip-text bg-gradient-to-r ${color}`} />
                  {label}
                </h3>
                <Link
                  href={`/creations/${type}`}
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 text-sm"
                >
                  See All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((creation, index) => (
                  <CreationCard key={creation.id} creation={creation} index={index} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link
            href="/creations"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all"
          >
            View All Creations
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}