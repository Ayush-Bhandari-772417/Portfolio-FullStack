// // frontend2\src\lib\seo\jsonld.ts
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

// export function homePageJsonLd(profile: any, settings: any) {
//   return {
//     "@context": "https://schema.org",
//     "@type": "Person",
//     name: profile?.name,
//     description: profile?.short_intro,
//     image: profile?.profile_image_url,
//     url: baseUrl,
//     sameAs: [
//       settings.github_url,
//       settings.linkedin_url,
//       settings.twitter_url,
//     ].filter(Boolean),
//     knowsAbout: profile?.keywords || [],
//   "@type": "WebSite",
//   "name": "Ayush Bhandari Portfolio",
//   "url": "https://bhandariayush.com.np",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://bhandariayush.com.np/creations?search={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
//   };
// }

// export function creationDetailJsonLd(cration: any, settings: any) {
//   return {
//     "@context": "https://schema.org",
//     '@type': cration.type === 'blog' ? 'BlogPosting' : 'Article',
//     headline: cration.title,
//     description: cration.description,
//     image: cration.image,
//     inLanguage: cration.language === 'ne' ? 'ne-NP' : 'en-US',
//     datePublished: cration.datePublished || cration.writtenDate,
//     dateModified: cration.dateModified,
//     author: { "@type": "Person", name: cration.author },
//     mainEntityOfPage: {
//       "@type": "WebPage",
//       "@id": `${baseUrl}${cration.path}`,
//     },
//     knowsAbout: cration.keywords || [],
//     keywords: cration.keywords.join(', '),
//     publisher: {
//       '@type': 'Organization',
//       name: settings.settings.site_name || 'Portfolio',
//       logo: {
//         '@type': 'ImageObject',
//         url: `${baseUrl}${settings.settings.site_logo || '/logo.png'}`,
//       },
//     },
//   "@type": "SpeakableSpecification",
//   "cssSelector": [".summary", ".intro"]
//   };
// }

// export function projectDetailJsonLd(project: any, settings: any) {
//   return {
//     '@context': 'https://schema.org',
//     '@type': 'CreativeWork',
//     name: project.title,
//     description: project.abstract,
//     image: project.featured_image_url,
//     author: {
//       '@type': 'Person',
//       name: settings.settings.author_name || 'Ayush Bhandari',
//     },
//     dateCreated: project.started_date,
//     dateModified: project.updated_at,
//     keywords: [...project.keywords, ...project.tags, ...project.technologies].join(', '),
//   "@type": "SpeakableSpecification",
//   "cssSelector": [".summary", ".intro"],
//   };
// }

// export function projectListJsonLd() {
//   return {
//     '@context': 'https://schema.org',
//     '@type': 'CollectionPage',
//     name: 'Projects Portfolio',
//     description: 'Collection of web development projects and applications',
//     url: `${baseUrl}/projects`,
//   "@type": "SpeakableSpecification",
//   "cssSelector": [".summary", ".intro"]
//   };
// }

// export function creationTypeJsonLd(data: any, type: any) {
//   return {
//     "@context": "https://schema.org",
//     "@type": "CollectionPage",
//     name: data.label,
//     description: `Collection of ${data.label.toLowerCase()}`,
//     url: `${baseUrl}/creations/${type}`,
//   "@type": "SpeakableSpecification",
//   "cssSelector": [".summary", ".intro"]
//   };
// }

// export function creationListJsonLd() {
//   return {
//     '@context': 'https://schema.org',
//     '@type': 'CollectionPage',
//     name: 'Creative Writings',
//     description: 'Collection of blog posts, poems, stories, and articles',
//     url: `${baseUrl}/creations`,
//   "@type": "SpeakableSpecification",
//   "cssSelector": [".summary", ".intro"]
//   };
// }








// src/lib/seo/jsonld.ts
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

/**
 * HOME PAGE
 * Used in: app/page.tsx
 */
export function homePageJsonLd(profile: any, settings: any) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile?.name,
      description: profile?.short_intro,
      image: profile?.profile_image_url,
      url: baseUrl,
      sameAs: [
        settings.github_url,
        settings.linkedin_url,
        settings.twitter_url,
      ].filter(Boolean),
      knowsAbout: profile?.keywords || [],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: settings.settings.site_name || "Portfolio",
      url: baseUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/creations?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

/**
 * CREATION DETAIL
 * Used in: creations/[type]/[slug]/page.tsx
 */
export function creationDetailJsonLd(creation: any, settings: any) {
  return [
    {
      "@context": "https://schema.org",
      "@type": creation.type === "blog" ? "BlogPosting" : "Article",
      headline: creation.title,
      description: creation.description,
      image: creation.image,
      inLanguage: creation.language === "ne" ? "ne-NP" : "en-US",
      datePublished: creation.datePublished || creation.writtenDate,
      dateModified: creation.dateModified,
      keywords: creation.keywords?.join(", "),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}${creation.path}`,
      },
      author: { "@type": "Person", name: creation.author },
      publisher: {
        "@type": "Organization",
        name: settings.settings.site_name,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}${settings.settings.site_logo || "/logo.png"}`,
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SpeakableSpecification",
      cssSelector: [".summary", ".intro"],
    },
  ];
}

/**
 * PROJECT DETAIL
 * Used in: projects/[slug]/page.tsx
 */
export function projectDetailJsonLd(project: any, settings: any) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.abstract,
      image: project.featured_image_url,
      dateCreated: project.started_date,
      dateModified: project.updated_at,
      keywords: [
        ...project.keywords,
        ...project.tags,
        ...project.technologies,
      ].join(", "),
      author: {
        "@type": "Person",
        name: settings.settings.author_name,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SpeakableSpecification",
      cssSelector: [".summary", ".intro"],
    },
  ];
}

/**
 * PROJECT LIST
 * Used in: projects/page.tsx
 */
export function projectListJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Projects Portfolio",
      description: "Collection of web development projects and applications",
      url: `${baseUrl}/projects`,
    },
    {
      "@context": "https://schema.org",
      "@type": "SpeakableSpecification",
      cssSelector: [".summary", ".intro"],
    },
  ];
}

/**
 * CREATION TYPE LIST
 * Used in: creations/[type]/page.tsx
 */
export function creationTypeJsonLd(data: any, type: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: data.label,
      description: `Collection of ${data.label.toLowerCase()}`,
      url: `${baseUrl}/creations/${type}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "SpeakableSpecification",
      cssSelector: [".summary", ".intro"],
    },
  ];
}

/**
 * CREATION LIST
 * Used in: creations/page.tsx
 */
export function creationListJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Creative Writings",
      description: "Collection of blog posts, poems, stories, and articles",
      url: `${baseUrl}/creations`,
    },
    {
      "@context": "https://schema.org",
      "@type": "SpeakableSpecification",
      cssSelector: [".summary", ".intro"],
    },
  ];
}
