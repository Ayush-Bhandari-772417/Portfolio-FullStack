// frontend2\src\app\creations\[type]\[slug]\page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCreationBySlug, getCreations, getSettings, getSEORobots, getDisplayLimit } from '@/lib/data';
import { Creation } from '@/types';
import CreationDetailClient from '@/components/CreationDetailClient';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const validTypes = ['blog', 'poem', 'story', 'article'] as const;
type CreationType = typeof validTypes[number];

// Helper to fetch category name
async function getCategoryName(categoryId: string | null): Promise<string | null> {
  if (!categoryId) return null;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/public'}/categories/${categoryId}/`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) return null;
    
    const category = await response.json();
    return category.name || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// Helper to get related creations across types
async function getRelatedCreations(
  currentCreation: Creation,
  currentType: CreationType,
  limit: number
): Promise<Creation[]> {
  const related: Creation[] = [];
  
  // 1. Try to get same type, same language
  const sameType = await getCreations({ type: currentType, limit: limit * 2 });
  const sameTypeFiltered = sameType.filter(
    c => c.slug !== currentCreation.slug && c.language === currentCreation.language
  );
  related.push(...sameTypeFiltered.slice(0, limit));
  
  // 2. If we don't have enough, get from other types with same language
  if (related.length < limit) {
    const needed = limit - related.length;
    const otherTypes = validTypes.filter(t => t !== currentType);
    
    for (const otherType of otherTypes) {
      if (related.length >= limit) break;
      
      const otherCreations = await getCreations({ type: otherType, limit: needed * 2 });
      const filtered = otherCreations.filter(
        c => c.language === currentCreation.language &&
        !related.some(r => r.id === c.id)
      );
      
      related.push(...filtered.slice(0, needed - related.length));
    }
  }
  
  return related.slice(0, limit);
}

export async function generateStaticParams() {
  const allCreations = await Promise.all(
    validTypes.map(type => getCreations({ type }))
  );
  
  return allCreations.flat().map(creation => ({
    type: creation.type,
    slug: creation.slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ type: string; slug: string }> 
}): Promise<Metadata> {
  const { type, slug } = await params;
  const [creation, settings] = await Promise.all([
    getCreationBySlug(slug, type),
    getSettings()
  ]);
  
  if (!creation) return { title: 'Creation Not Found' };

  const siteName = settings.settings.site_name || 'Portfolio';
  const siteDescription = settings.settings.site_description || '';
  const authorName = settings.settings.author_name || 'Ayush Bhandari';
  
  const pageTitle = `${creation.title} | ${siteName}`;
  const pageDescription = creation.excerpt || siteDescription;
  const ogImage = creation.featured_image_url || settings.settings.default_og_image || '/logo.png';
  
  const robotsContent = getSEORobots(settings, `${type}-detail`);

  // Get all translations of this creation
  const allCreations = await getCreations({ type: type as CreationType });
  const alternateLanguages = allCreations.filter(
    c => c.translation_key === creation.translation_key && c.slug !== creation.slug
  );

  const languages: Record<string, string> = {
    [creation.language]: `${baseUrl}/creations/${creation.type}/${creation.slug}`,
  };

  alternateLanguages.forEach(alt => {
    languages[alt.language] = `${baseUrl}/creations/${alt.type}/${alt.slug}`;
  });

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: creation.keywords.join(', '),
    authors: [{ name: authorName }],
    robots: robotsContent,
    alternates: { 
      canonical: `${baseUrl}/creations/${creation.type}/${creation.slug}`,
      languages,
    },
    openGraph: {
      type: 'article',
      url: `${baseUrl}/creations/${creation.type}/${creation.slug}`,
      title: creation.title,
      description: pageDescription,
      siteName: siteName,
      locale: creation.language === 'ne' ? 'ne_NP' : 'en_US',
      images: [{ 
        url: ogImage, 
        width: 1200, 
        height: 630, 
        alt: creation.featured_image_alt || creation.title 
      }],
      publishedTime: creation.published_date || creation.written_date,
      modifiedTime: creation.updated_date,
      authors: [authorName],
      tags: creation.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: creation.title,
      description: pageDescription,
      images: [ogImage],
      creator: settings.settings.twitter_handle || undefined,
    },
  };
}

export default async function CreationDetailPage({ 
  params 
}: { 
  params: Promise<{ type: string; slug: string }> 
}) {
  const { type, slug } = await params;
  
  if (!validTypes.includes(type as CreationType)) {
    notFound();
  }

  const [creation, settings] = await Promise.all([
    getCreationBySlug(slug, type),
    getSettings()
  ]);
  
  if (!creation) notFound();

  const categoryName = await getCategoryName(creation.category);

  // Get display limit from settings
  const relatedLimit = getDisplayLimit(settings, 'detail', type, 5);
  
  // Get related creations (same type first, then other types if needed)
  const relatedCreations = await getRelatedCreations(
    creation,
    type as CreationType,
    relatedLimit
  );

  const authorName = settings.settings.author_name || 'Ayush Bhandari';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': creation.type === 'blog' ? 'BlogPosting' : 'Article',
            headline: creation.title,
            description: creation.excerpt,
            image: creation.featured_image_url,
            inLanguage: creation.language === 'ne' ? 'ne-NP' : 'en-US',
            datePublished: creation.published_date || creation.written_date,
            dateModified: creation.updated_date,
            author: {
              '@type': 'Person',
              name: authorName,
            },
            publisher: {
              '@type': 'Organization',
              name: settings.settings.site_name || 'Portfolio',
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}${settings.settings.site_logo || '/logo.png'}`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${baseUrl}/creations/${creation.type}/${creation.slug}`,
            },
            keywords: creation.keywords.join(', '),
          }),
        }}
      />

      <CreationDetailClient 
        creation={creation} 
        relatedCreations={relatedCreations}
        settings={settings}
        categoryName={categoryName}
      />
    </>
  );
}