// frontend2\src\app\page.tsx
import Hero from '@/components/portfolioSections/Hero';
import About from '@/components/portfolioSections/About';
import SkillsClient from '@/components/SkillsClient';
import QualificationsClient from '@/components/QualificationsClient';
import ExperienceSection from '@/components/portfolioSections/ExperienceSection';
import ServicesClient from '@/components/ServicesClient';
import FeaturedProjectsSection from '@/components/portfolioSections/FeaturedProjectsSection';
import CreationsPreviewSection from '@/components/portfolioSections/CreationsPreviewSection';
import ContactSection from '@/components/portfolioSections/ContactSection';
import { getBootstrap, getDisplayLimit } from "@/lib/data";
import { normalizeSettingsFromBootstrap } from '@/lib/normalizeSettings';
import type { Metadata } from 'next';
import { buildMetadata } from "@/lib/seo/metadata";
import { homePageJsonLd } from "@/lib/seo/jsonld";
import { websiteJsonLd } from '@/lib/seo/website';
import { breadcrumbsJsonLd } from '@/lib/seo/breadcrumbs';
import { speakableJsonLd } from '@/lib/seo/speakable';

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const bootstrap = await getBootstrap();
  const settings = normalizeSettingsFromBootstrap(bootstrap);
  const profile = bootstrap.profile;

  return buildMetadata({
    settings: settings,
    page: "homepage",
    title: settings.settings.home_page_title,
    description: settings.settings.home_page_description,
    path: "/",
    image: profile?.profile_image_url,
    publishedTime: profile?.created_at,
    modifiedTime: profile?.updated_at,
    keywords: profile?.keywords,
  });
}

export default async function HomePage() {
  const bootstrap = await getBootstrap();
  const {
    profile,
    services,
    skills,
    experience,
    qualifications,
    social_media,
  } = bootstrap;

  // 🔥 normalize settings here
  const settings = normalizeSettingsFromBootstrap(bootstrap);

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
          __html: JSON.stringify([
            homePageJsonLd(profile, settings),
            websiteJsonLd(),
            breadcrumbsJsonLd([]),
            speakableJsonLd(),
          ]),
        }}
      />

      <main className="min-h-screen">
        <Hero profile={profile} settings={settings} />
        <About profile={profile} settings={settings} />
        {showSkills && <SkillsClient skills={skills.slice(0, getDisplayLimit(settings, 'home', 'skills', 10))} />}
        {showQualifications && <QualificationsClient qualifications={qualifications.slice(0, getDisplayLimit(settings, 'home', 'qualifications', 10))} />}
        {showExperience && <ExperienceSection experiences={experience.slice(0, getDisplayLimit(settings, 'home', 'experiences', 3))} />}
        {showServices && <ServicesClient services={services.slice(0, getDisplayLimit(settings, 'home', 'services', 6))} />}
        {showProjects && <FeaturedProjectsSection settings={settings} />}
        {showCreations && <CreationsPreviewSection settings={settings} />}
        {showContact && <ContactSection settings={settings} />}
      </main>
    </>
  );
}

// export async function generateMetadata(): Promise<Metadata> {
//   const bootstrap = await getBootstrap();

//   const {
//     profile,
//     services,
//     skills,
//     experience,
//     qualifications,
//     social_media,
//   } = bootstrap;

//   // 🔥 normalize settings here
//   const settings = normalizeSettingsFromBootstrap(bootstrap);
  
//   const pageTitle = settings.settings.home_page_title || 'Home';
//   const siteTitle = settings.settings.site_title || 'Ayush Bhandari | Portfolio';
//   const pageDescription = settings.settings.home_page_description || 
//     `Welcome to ${profile?.name || 'Ayush Bhandari'}'s portfolio showcasing projects and creations.`;
//   const ogImage = settings.settings.home_og_image || '/logo.png';
//   const robots = getSEORobots(settings, 'home');
  
//   const keywords = [
//     ...(profile?.keywords || []),
//     ...(settings.settings.home_page_keywords?.split(',').map((k: string) => k.trim()) || [])
//   ].filter(Boolean);

//   return {
//     title: pageTitle,
//     description: pageDescription,
//     keywords: keywords.join(', '),
//     alternates: { 
//       canonical: baseUrl 
//     },
//     openGraph: {
//       type: 'website',
//       url: baseUrl,
//       title: settings.settings.home_og_title || siteTitle,
//       description: settings.settings.home_og_description || pageDescription,
//       images: [{ 
//         url: ogImage, 
//         width: 1200, 
//         height: 630, 
//         alt: settings.settings.home_og_image_alt || 'Ayush Portfolio' 
//       }],
//       siteName: settings.settings.site_name || 'Ayush Bhandari',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: settings.settings.home_twitter_title || siteTitle,
//       description: settings.settings.home_twitter_description || pageDescription,
//       images: [ogImage],
//       creator: settings.settings.twitter_handle || '@AyushBhandari',
//     },
//     robots,
//     other: {
//       'og:locale': settings.settings.site_language || 'en_US',
//       'article:author': profile?.name || settings.settings.author_name || 'Ayush Bhandari',
//     },
//   };
// }


      {/* <script
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
      /> */}