// frontend2\src\app\creations\page.tsx
import { Metadata } from 'next';
import { getCreations, getSettings, getSEORobots, getDisplayLimit } from '@/lib/data';
import CreationCard from '@/components/CreationCard';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { BookOpen, Sparkles, FileText, Newspaper } from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const creationTypes = [
  { type: 'blog', label: 'Blog Posts', icon: Newspaper, color: 'from-blue-500 to-cyan-500' },
  { type: 'poem', label: 'Poems', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { type: 'story', label: 'Stories', icon: BookOpen, color: 'from-orange-500 to-red-500' },
  { type: 'article', label: 'Articles', icon: FileText, color: 'from-green-500 to-emerald-500' },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  const pageTitle = settings.settings.creations_page_title || 'Creations';
  const pageDescription = settings.settings.creations_page_description || 
    'Explore my creative writings including blog posts, poems, stories, and articles.';
  const ogImage = settings.settings.creations_og_image || '/logo.png';
  const robots = getSEORobots(settings, 'creations');

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: settings.settings.creations_page_keywords || 'blog, poems, stories, articles, creative writing',
    alternates: { 
      canonical: `${baseUrl}/creations` 
    },
    openGraph: {
      type: 'website',
      url: `${baseUrl}/creations`,
      title: settings.settings.creations_og_title || pageTitle,
      description: settings.settings.creations_og_description || pageDescription,
      images: [{ 
        url: ogImage, 
        width: 1200, 
        height: 630, 
        alt: 'Creative Writings' 
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.settings.creations_twitter_title || pageTitle,
      description: settings.settings.creations_twitter_description || pageDescription,
      images: [ogImage],
    },
    robots,
  };
}

export default async function CreationsPage() {
  const settings = await getSettings();
  
  const previewLimit = getDisplayLimit(settings, 'creations_overview', 'items', 4);

  const [blogs, poems, stories, articles] = await Promise.all([
    getCreations({ type: 'blog', limit: previewLimit }),
    getCreations({ type: 'poem', limit: previewLimit }),
    getCreations({ type: 'story', limit: previewLimit }),
    getCreations({ type: 'article', limit: previewLimit }),
  ]);

  const creationSections = [
    { type: 'blog', label: 'Blog Posts', items: blogs, icon: Newspaper, color: 'from-blue-500 to-cyan-500' },
    { type: 'poem', label: 'Poems', items: poems, icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { type: 'story', label: 'Stories', items: stories, icon: BookOpen, color: 'from-orange-500 to-red-500' },
    { type: 'article', label: 'Articles', items: articles, icon: FileText, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Creative Writings',
            description: 'Collection of blog posts, poems, stories, and articles',
            url: `${baseUrl}/creations`,
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <PageHeader
          title="My Creations"
          subtitle="Explore my creative writings across different formats"
          gradient="from-purple-600 via-pink-600 to-orange-500"
        />

        {/* Category Cards */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creationTypes.map(({ type, label, icon: Icon, color }) => (
              <Link
                key={type}
                href={`/creations/${type}`}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <Icon className={`w-12 h-12 mb-4 text-transparent bg-clip-text bg-gradient-to-r ${color}`} />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{label}</h3>
                <p className="text-slate-600">Explore {label.toLowerCase()}</p>
                <div className="mt-4 flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-2 transition-transform">
                  View All →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Sections for each type */}
        {creationSections.map(({ type, label, items, icon: Icon, color }) => (
          items.length > 0 && (
            <section key={type} className="container mx-auto px-6 py-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <Icon className={`w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r ${color}`} />
                  Latest {label}
                </h2>
                <Link
                  href={`/creations/${type}`}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all"
                >
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((creation, index) => (
                  <CreationCard key={creation.id} creation={creation} index={index} />
                ))}
              </div>
            </section>
          )
        ))}

        {/* Empty State */}
        {creationSections.every(section => section.items.length === 0) && (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
              <p className="text-xl text-slate-600">No creations found</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}