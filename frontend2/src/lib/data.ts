// frontend2\src\lib\data.ts
import { cache } from 'react';
import { AllSettings } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL!;

/* -------------------- 1. Single fetch with revalidation -------------------- */
async function apiFetch(url: string) {
  const res = await fetch(API + url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to load data from " + API + ": " + url);
  return res.json();
}

/* -------------------- 2. DRF results unwrapper -------------------- */
function unwrap(data: any) {
  return data.results ? data.results : data;
}

/* -------------------- 3. Bootstrap -------------------- */
export const getBootstrap = cache(async () => {
  return apiFetch('/bootstrap/');
});

/* -------------------- 4 & 5. Projects -------------------- */
export const getProjects = cache(async (params?: {
  featured?: boolean;
  limit?: number;
  category?: string;
}) => {
  const qs = new URLSearchParams(params as any).toString();
  const data = await apiFetch(`/projects/?${qs}`);
  return unwrap(data);
});

export const getProjectBySlug = cache(async (slug: string) => {
  return apiFetch(`/projects/${slug}`);
});

/* -------------------- 6 & 7. Creations -------------------- */
export const getCreations = cache(async (params?: {
  type?: "blog" | "poem" | "story" | "article";
  limit?: number;
  category?: string;
}) => {
  const qs = new URLSearchParams(params as any).toString();
  const data = await apiFetch(`/creations/?${qs}`);
  return unwrap(data);
});

export const getCreationBySlug = cache(async (slug: string, type?: string) => {
  const qs = type ? `?type=${type}` : '';
  return apiFetch(`/creations/${slug}/${qs}`);
});

// Helper functions
export function getDisplayLimit(settings: AllSettings, context: string, itemType: string, defaultLimit: number = 6): number {
  return settings.display[context]?.[itemType]?.limit || defaultLimit;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
}