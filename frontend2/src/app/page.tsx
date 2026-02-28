// frontend2\src\app\page.tsx
import Hero from '@/components/portfolioSections/Hero';
import About from '@/components/portfolioSections/About';
import SkillsSection from '@/components/portfolioSections/SkillsSection';
import QualificationsSection from '@/components/portfolioSections/QualificationsSection';
import ExperienceSection from '@/components/portfolioSections/ExperienceSection';
import ServicesSection from '@/components/portfolioSections/ServicesSection';
import FeaturedProjectsSection from '@/components/portfolioSections/FeaturedProjectsSection';
import CreationsPreviewSection from '@/components/portfolioSections/CreationsPreviewSection';
import ContactSection from '@/components/portfolioSections/ContactSection';
import { getProfile, getSettings, getSEORobots } from '@/lib/data';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const profile = await getProfile();
  
  const pageTitle = settings.settings.home_page_title || 'Home';
  const siteTitle = settings.settings.site_title || 'Ayush Bhandari | Portfolio';
  const pageDescription = settings.settings.home_page_description || 
    `Welcome to ${profile?.name || 'Ayush Bhandari'}'s portfolio showcasing projects and creations.`;
  const ogImage = settings.settings.home_og_image || '/logo.png';
  const robots = getSEORobots(settings, 'home');
  
  const keywords = [
    ...(profile?.keywords || []),
    ...(settings.settings.home_page_keywords?.split(',').map((k: string) => k.trim()) || [])
  ].filter(Boolean);

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords.join(', '),
    alternates: { 
      canonical: baseUrl 
    },
    openGraph: {
      type: 'website',
      url: baseUrl,
      title: settings.settings.home_og_title || siteTitle,
      description: settings.settings.home_og_description || pageDescription,
      images: [{ 
        url: ogImage, 
        width: 1200, 
        height: 630, 
        alt: settings.settings.home_og_image_alt || 'Ayush Portfolio' 
      }],
      siteName: settings.settings.site_name || 'Ayush Bhandari',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.settings.home_twitter_title || siteTitle,
      description: settings.settings.home_twitter_description || pageDescription,
      images: [ogImage],
      creator: settings.settings.twitter_handle || '@AyushBhandari',
    },
    robots,
    other: {
      'og:locale': settings.settings.site_language || 'en_US',
      'article:author': profile?.name || settings.settings.author_name || 'Ayush Bhandari',
    },
  };
}

export default async function HomePage() {
  const profile = await getProfile();
  const settings = await getSettings();
  const showSkills = settings.settings.home_show_skills !== false;
  const showQualifications = settings.settings.home_show_qualifications !== false;
  const showExperience = settings.settings.home_show_experience !== false;
  const showServices = settings.settings.home_show_services !== false;
  const showProjects = settings.settings.home_show_projects !== false;
  const showCreations = settings.settings.home_show_creations !== false;
  const showContact = settings.settings.home_show_contact !== false;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: profile?.name || settings.settings.author_name || 'Ayush Bhandari',
            jobTitle: profile?.tagline || 'Software Engineer',
            description: profile?.short_intro || profile?.headline,
            image: profile?.profile_image_url,
            url: baseUrl,
            sameAs: [
              settings.settings.github_url,
              settings.settings.linkedin_url,
              settings.settings.twitter_url,
            ].filter(Boolean),
            knowsAbout: profile?.keywords || [],
          }),
        }}
      />

      <main className="min-h-screen">
        <Hero profile={profile} settings={settings} />
        <About profile={profile} settings={settings} />
        {showSkills && <SkillsSection settings={settings} />}
        {showQualifications && <QualificationsSection settings={settings} />}
        {showExperience && <ExperienceSection settings={settings} />}
        {showServices && <ServicesSection settings={settings} />}
        {showProjects && <FeaturedProjectsSection settings={settings} />}
        {showCreations && <CreationsPreviewSection settings={settings} />}
        {showContact && <ContactSection />}
      </main>
    </>
  );
}