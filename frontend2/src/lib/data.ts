// frontend2\src\lib\data.ts
import { cache } from 'react';
import { Project, AllSettings, Creation } from '@/types';
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const getBootstrap = cache(async () => {
  const res = await fetch(`${API_BASE}/bootstrap/`, {
    next: { revalidate: 3600 }, // ISR 1 hour
  });
  if (!res.ok) {
    throw new Error("Failed to fetch bootstrap data");
  }
  return res.json();
});

// Projects
export const getProjects = cache(async (params?: { featured?: boolean; limit?: number; category?: string; }): Promise<Project[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.featured) queryParams.append("featured", "true");
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.category) queryParams.append("category", params.category);

    const endpoint = `${API_BASE}/projects/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const res = await fetch(endpoint, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  try {
    const res = await fetch(`${API_BASE}/projects/${slug}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();

  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
});

// Creations
export const getCreations = cache(async (params?: {
  type?: "blog" | "poem" | "story" | "article";
  limit?: number;
  category?: string;
}): Promise<Creation[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append("type", params.type);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.category) queryParams.append("category", params.category);

    const endpoint = `${API_BASE}/creations/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const res = await fetch(endpoint, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching creations:", error);
    return [];
  }
});

export const getCreationBySlug = cache(async (
  slug: string,
  type?: string
): Promise<Creation | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (type) queryParams.append("type", type);
    const endpoint = `${API_BASE}/creations/${slug}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const res = await fetch(endpoint, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();

  } catch (error) {
    console.error("Error fetching creation:", error);
    return null;
  }
});

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
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
}

// export function formatDate(dateString: string): string {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', { 
//     year: 'numeric', 
//     month: 'long', 
//     day: 'numeric',
//     timeZone: 'UTC' 
//   });
// }