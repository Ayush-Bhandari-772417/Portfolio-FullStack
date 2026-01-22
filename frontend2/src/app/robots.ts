// frontend2\src\app\robots.ts
import { MetadataRoute } from 'next';
import { getSettings } from '@/lib/data';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  
  // Get SEO settings for different page types
  const homeIndexed = settings.seo.home?.index !== false;
  const projectsIndexed = settings.seo.projects?.index !== false;
  const creationsIndexed = settings.seo.creations?.index !== false;
  
  // Build disallow rules
  const disallow: string[] = ['/api/', '/admin/'];
  
  // Add pages that shouldn't be indexed
  if (!homeIndexed) disallow.push('/');
  if (!projectsIndexed) disallow.push('/projects');
  if (!creationsIndexed) disallow.push('/creations');
  
  // Add non-public creation types
  const creationTypes = ['blog', 'poem', 'story', 'article'];
  creationTypes.forEach(type => {
    const key = `${type}-list`;
    if (settings.seo[key]?.index === false) {
      disallow.push(`/creations/${type}`);
    }
  });

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}