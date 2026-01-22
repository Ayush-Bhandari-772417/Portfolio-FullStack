// frontend2\src\types\index.ts
export interface Contact {
  id: number;
  email: string;
  message: string;
  created_at: string;
  ip_address: string;
  user_agent: string;
}

export interface Category {
  id: number;
  name: string;
  is_public: boolean;
}

export interface Creation {
  id: number;
  user: string;
  title: string;
  slug: string;
  is_public: boolean;
  language: string;
  translation_key: string;
  featured_image?: File | null;
  featured_image_alt: string | null;
  featured_image_url?: string | null;
  type: "blog" | "poem" | "story" | "article";
  category: string | null; // Will be category ID
  keywords: string[];
  excerpt: string;
  written_date: string;
  published_date: string | null;
  published_in: string | null;
  posted_date: string;
  updated_date: string;
  content_json?: JSON;
  content_html?: string;
}

export interface Experience {
  id: number;
  title: string;
  organization: string;
  organization_url: string | null;
  location: string;
  location_url: string | null;
  start_date: string;
  end_date: string | null;
  responsibilities: string[];
  is_public: boolean;
}

export interface HireMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  details: string;
  stipend: string;
  posted_at: string;
  ip_address: string;
  user_agent: string;
}

export interface Profile {
  id: number;
  name: string;
  tagline: string;
  headline: string;
  short_intro: string;
  profile_image?: string | null;
  profile_image_alt?: string | null;
  profile_image_url?: string | null;
  resume?: string | null;
  resume_alt?: string | null;
  resume_url?: string | null;
  about_image?: string | null;
  about_image_alt?: string | null;
  about_image_url?: string | null;
  about_text: string;
  years_of_experience: number;
  projects_completed: number;
  logo?: string | null;
  logo_alt?: string | null;
  logo_url?: string | null;
  named_logo?: string | null;
  named_logo_alt?: string | null;
  named_logo_url?: string | null;
  keywords?: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  user: number;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string;
  abstract: string;
  features: string[];
  technologies: string[];
  keywords: string[];
  tags: string[];
  featured_image: string | null;
  featured_image_alt: string | null;
  featured_image_url: string | null;
  repository_link: string | null;
  live_link: string | null;
  demo: string | null;
  contributors: string[];
  status: 'ongoing' | 'completed' | 'paused';
  project_type: 'academic' | 'personal' | 'client';
  is_public: boolean;
  featured: boolean;
  client_feedback: string | null;
  started_date: string;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
  gallery_images?: ProjectGalleryImage[];
}

export interface ProjectGalleryImage {
  id: number;
  project: number;
  image: string;
  caption: string | null;
  order: number;
}

export interface Qualification {
  id: number;
  board_name: string;
  school_name: string;
  school_url: string | null;
  location: string;
  location_url: string | null;
  enrolled_year: number | string;
  passed_year: number | string | null;
  grade: string | null;
  description: string | null;
  is_public: boolean;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: number;
  type: 'text' | 'textarea' | 'boolean' | 'number' | 'color';
  key: string;
  value: string;
  description: string | null;
  is_public: boolean;
}

export interface SEOPageSetting {
  id: number;
  page: string;
  index: boolean;
  follow: boolean;
  is_public: boolean;
}

export interface SitemapSetting {
  id: number;
  page: string;
  include: boolean;
  priority: number;
  changefreq: string;
  is_public: boolean;
}

export interface DisplaySetting {
  id: number;
  context: string;
  item_type: string;
  limit: number;
  is_public: boolean;
}

export interface AllSettings {
  settings: Record<string, any>;
  seo: Record<string, SEOPageSetting>;
  sitemap: Record<string, SitemapSetting>;
  display: Record<string, Record<string, DisplaySetting>>;
}

export interface SubSkill {
  id: number;
  skill: string;
  name: string;
  icon: string | null;
  level: string;
  rating: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  icon: string | null;
  is_public: boolean;
  subskills: SubSkill[];
  created_at: string;
  updated_at: string;
}

export interface SocialMedia {
  id: number;
  name: string;
  url: string;
  icon: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  email: string;
  subscribed_at: string;
  ip_address: string;
  user_agent: string;
}