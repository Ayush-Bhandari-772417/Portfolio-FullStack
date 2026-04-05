// frontend2\src\lib\seo\website.ts
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ayush Bhandari Portfolio",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/creations?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}