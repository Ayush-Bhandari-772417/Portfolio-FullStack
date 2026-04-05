// import {
//   Setting,
//   SEOPageSetting,
//   SitemapSetting,
//   DisplaySetting,
//   AllSettings,
// } from "@/types";

// export function normalizeSettingsFromBootstrap(bootstrap: any): AllSettings {
//   const rawSettings = Array.isArray(bootstrap.settings)
//     ? bootstrap.settings
//     : [];

//   const rawSEO = Array.isArray(bootstrap.seo)
//     ? bootstrap.seo
//     : [];

//   const rawSitemap = Array.isArray(bootstrap.sitemap)
//     ? bootstrap.sitemap
//     : [];

//   // display is already structured object
//   const rawDisplay = bootstrap.display || {};

//   // ---- SETTINGS MAP ----
//   const settingsMap: Record<string, any> = {};

//   rawSettings.forEach((setting) => {
//     if (!setting.is_public) return;

//     let value: any = setting.value;

//     switch (setting.type) {
//       case "boolean":
//         value = setting.value.toLowerCase() === "true";
//         break;
//       case "number":
//         value = parseFloat(setting.value) || 0;
//         break;
//       default:
//         value = setting.value;
//     }

//     settingsMap[setting.key] = value;
//   });

//   // ---- SEO MAP ----
//   const seoMap: Record<string, SEOPageSetting> = {};
//   rawSEO.forEach((seo) => {
//     if (seo.is_public) {
//       seoMap[seo.page] = seo;
//     }
//   });

//   // ---- SITEMAP MAP ----
//   const sitemapMap: Record<string, SitemapSetting> = {};
//   rawSitemap.forEach((sitemap) => {
//     if (sitemap.is_public) {
//       sitemapMap[sitemap.page] = sitemap;
//     }
//   });

//   return {
//     settings: settingsMap,
//     seo: seoMap,
//     sitemap: sitemapMap,
//     display: rawDisplay, // 🔥 just pass through
//   };
// }

import {
  Setting,
  SEOPageSetting,
  SitemapSetting,
  DisplaySetting,
  AllSettings,
} from "@/types";

export function normalizeSettingsFromBootstrap(
  bootstrap: any
): AllSettings {

  const rawSettings: Setting[] = Array.isArray(bootstrap.settings)
    ? bootstrap.settings
    : [];

  const rawSEO: SEOPageSetting[] = Array.isArray(bootstrap.seo)
    ? bootstrap.seo
    : [];

  const rawSitemap: SitemapSetting[] = Array.isArray(bootstrap.sitemap)
    ? bootstrap.sitemap
    : [];

  const rawDisplay: Record<string, Record<string, DisplaySetting>> =
    bootstrap.display || {};

  // ---- SETTINGS MAP ----
  const settingsMap: Record<string, any> = {};

  rawSettings.forEach((setting: Setting) => {
    if (!setting.is_public) return;

    let value: any = setting.value;

    switch (setting.type) {
      case "boolean":
        value = setting.value.toLowerCase() === "true";
        break;
      case "number":
        value = parseFloat(setting.value) || 0;
        break;
      default:
        value = setting.value;
    }

    settingsMap[setting.key] = value;
  });

  // ---- SEO MAP ----
  const seoMap: Record<string, SEOPageSetting> = {};
  rawSEO.forEach((seo: SEOPageSetting) => {
    if (seo.is_public) {
      seoMap[seo.page] = seo;
    }
  });

  // ---- SITEMAP MAP ----
  const sitemapMap: Record<string, SitemapSetting> = {};
  rawSitemap.forEach((sitemap: SitemapSetting) => {
    if (sitemap.is_public) {
      sitemapMap[sitemap.page] = sitemap;
    }
  });

  return {
    settings: settingsMap,
    seo: seoMap,
    sitemap: sitemapMap,
    display: rawDisplay,
  };
}