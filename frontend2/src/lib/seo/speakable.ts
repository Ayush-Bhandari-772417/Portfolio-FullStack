// frontend2\src\lib\seo\speakable.ts
export function speakableJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    cssSelector: [".summary", ".intro"],
  };
}