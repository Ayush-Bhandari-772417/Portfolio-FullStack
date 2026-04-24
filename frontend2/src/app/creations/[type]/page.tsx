// frontend2\src\app\creations\[type]\page.tsx
import { Metadata } from 'next';
import { getCreations, getBootstrap, getDisplayLimit } from '@/lib/data';
import CreationCard from '@/components/cards/CreationCard';
import PageHeader from '@/components/PageHeader';
import { BookOpen, Sparkles, FileText, Newspaper } from 'lucide-react';
import { normalizeSettingsFromBootstrap } from '@/lib/normalizeSettings';
import { buildMetadata } from '@/lib/seo/metadata';
import { creationTypeJsonLd } from '@/lib/seo/jsonld';
import { websiteJsonLd } from '@/lib/seo/website';
import { breadcrumbsJsonLd } from '@/lib/seo/breadcrumbs';
import { speakableJsonLd } from '@/lib/seo/speakable';

export const revalidate = 3600;
export const dynamic = "force-dynamic";

const validTypes = ['blog', 'poem', 'story', 'article'] as const;
type CreationType = typeof validTypes[number];

const typeConfig = {
  blog: { label: 'Blog Posts', icon: Newspaper, color: 'from-blue-500 to-cyan-500' },
  poem: { label: 'Poems', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  story: { label: 'Stories', icon: BookOpen, color: 'from-orange-500 to-red-500' },
  article: { label: 'Articles', icon: FileText, color: 'from-green-500 to-emerald-500' },
};

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ type: string }> 
}): Promise<Metadata> {
  const { type } = await params;
  
  if (!validTypes.includes(type as CreationType)) {
    return { title: 'Not Found' };
  }
  
  const bootstrap = await getBootstrap();
  const settings = normalizeSettingsFromBootstrap(bootstrap);
  const config = typeConfig[type as CreationType];
  const ogImage = settings.settings[`${type}_og_image`] || '/logo.png';

  return buildMetadata({
    settings: settings,
    page: "creation-detail-page",
    title: `${config.label} - Creations`,
    description: `Explore my ${config.label.toLowerCase()} - creative writings and insights.`,
    path: `/creations/${type}`,
    image: ogImage,
    keywords: [`${config.label.toLowerCase()}, creative writing, ${type}`],
  });
}

export default async function CreationTypePage({ 
  params 
}: { 
  params: Promise<{ type: string }> 
}) {
  const { type } = await params;
  
  if (!validTypes.includes(type as CreationType)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Invalid Type</h2>
          <p className="text-slate-600">The creation type "{type}" does not exist.</p>
        </div>
      </div>
    );
  }

  const typedType = type as CreationType;
  const config = typeConfig[typedType];
  const Icon = config.icon;
  const bootstrap = await getBootstrap();
  const settings = normalizeSettingsFromBootstrap(bootstrap);

  const creationsLimit = getDisplayLimit(settings, 'creations_type', 'creations', 20);
  const creation = await getCreations({ type: typedType });
  const creations = creation.slice(0, creationsLimit);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            creationTypeJsonLd(config, type),
            websiteJsonLd(),
            breadcrumbsJsonLd([]),
            speakableJsonLd(),
          ]),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
        <PageHeader
          title={config.label}
          subtitle={`Explore all my ${config.label.toLowerCase()}`}
          gradient={config.color}
          icon={<Icon className="w-12 h-12" />}
        />

        <section className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creations.map((creation, index) => (
              <CreationCard key={creation.id} creation={creation} index={index} />
            ))}
          </div>

          {creations.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
                <Icon className={`w-16 h-16 mx-auto mb-4 text-transparent bg-clip-text bg-gradient-to-r ${config.color}`} />
                <p className="text-xl text-slate-600">No {config.label.toLowerCase()} found</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}