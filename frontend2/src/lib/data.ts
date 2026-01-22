// frontend2\src\lib\data.ts
import { Project, Profile, Category, AllSettings, Setting, SEOPageSetting, SitemapSetting, DisplaySetting, Creation, Service, Skill, SubSkill, Experience, Qualification } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/public';

async function fetchAPI(endpoint: string) {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.results ?? data;
}

// Settings
export async function getSettings(): Promise<AllSettings> {
  try {
    const [settings, seoSettings, sitemapSettings, displaySettings] = await Promise.all([
      fetchAPI('/settings/'),
      fetchAPI('/seosettings/'),
      fetchAPI('/sitemapsettings/'),
      fetchAPI('/displaysettings/'),
    ]);

    const settingsMap: Record<string, any> = {};
    if (settings && Array.isArray(settings)) {
      settings.forEach((setting: Setting) => {
        if (setting.is_public) {
          let value: any = setting.value;
          switch (setting.type) {
            case 'boolean':
              value = setting.value.toLowerCase() === 'true';
              break;
            case 'number':
              value = parseFloat(setting.value) || 0;
              break;
            default:
              value = setting.value;
          }
          settingsMap[setting.key] = value;
        }
      });
    }

    const seoMap: Record<string, SEOPageSetting> = {};
    if (seoSettings && Array.isArray(seoSettings)) {
      seoSettings.forEach((seo: SEOPageSetting) => {
        if (seo.is_public) seoMap[seo.page] = seo;
      });
    }

    const sitemapMap: Record<string, SitemapSetting> = {};
    if (sitemapSettings && Array.isArray(sitemapSettings)) {
      sitemapSettings.forEach((sitemap: SitemapSetting) => {
        if (sitemap.is_public) sitemapMap[sitemap.page] = sitemap;
      });
    }

    const displayMap: Record<string, Record<string, DisplaySetting>> = {};
    if (displaySettings && Array.isArray(displaySettings)) {
      displaySettings.forEach((display: DisplaySetting) => {
        if (display.is_public) {
          if (!displayMap[display.context]) displayMap[display.context] = {};
          displayMap[display.context][display.item_type] = display;
        }
      });
    }

    return { settings: settingsMap, seo: seoMap, sitemap: sitemapMap, display: displayMap };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { settings: {}, seo: {}, sitemap: {}, display: {} };
  }
}

// Profile
export async function getProfile(): Promise<Profile | null> {
  try {
    const data = await fetchAPI('/profile/');
    if (!data) return null;
    if (Array.isArray(data) && data.length > 0) return data[0];
    if (data && !Array.isArray(data) && data.id) return data as Profile;
    return null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

// Projects
export async function getProjects(params?: { featured?: boolean; limit?: number; category?: string }): Promise<Project[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    
    const endpoint = `/projects/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchAPI(endpoint);
    
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const data = await fetchAPI(`/projects/${slug}/`);
    if (!data) return null;
    return data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

// Creations
export async function getCreations(params?: { 
  type?: 'blog' | 'poem' | 'story' | 'article'; 
  limit?: number;
  category?: string;
}): Promise<Creation[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    
    const endpoint = `/creations/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchAPI(endpoint);
    
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching creations:', error);
    return [];
  }
}

export async function getCreationBySlug(slug: string, type?: string): Promise<Creation | null> {
  try {
    const queryParams = new URLSearchParams({ slug });
    if (type) queryParams.append('type', type);
    console.log('Fetching creation with slug:', slug);
    const data = await fetchAPI(`/creations/${slug}`);
    if (!data) return null;
    return data;
  } catch (error) {
    console.error('Error fetching creation:', error);
    return null;
  }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchAPI('/categories/');
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Services
export async function getServices(): Promise<Service[]> {
  try {
    const data = await fetchAPI('/services/');
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

// Skills
export async function getSkills(): Promise<Skill[]> {
  try {
    const data = await fetchAPI('/skills/');
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

export async function getSubSkills(skillId?: number): Promise<SubSkill[]> {
  try {
    const endpoint = skillId ? `/subskills/?skill=${skillId}` : '/subskills/';
    const data = await fetchAPI(endpoint);
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching subskills:', error);
    return [];
  }
}

// Experience
export async function getExperiences(): Promise<Experience[]> {
  try {
    const data = await fetchAPI('/experiences/');
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}

// Qualifications
export async function getQualifications(): Promise<Qualification[]> {
  try {
    const data = await fetchAPI('/qualifications/');
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching qualifications:', error);
    return [];
  }
}

// Helper functions
export function getSEORobots(settings: AllSettings, page: string): string {
  const seo = settings.seo[page];
  if (!seo) return 'index, follow';
  const index = seo.index ? 'index' : 'noindex';
  const follow = seo.follow ? 'follow' : 'nofollow';
  return `${index}, ${follow}`;
}

export function getDisplayLimit(settings: AllSettings, context: string, itemType: string, defaultLimit: number = 6): number {
  return settings.display[context]?.[itemType]?.limit || defaultLimit;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'UTC' 
  });
}