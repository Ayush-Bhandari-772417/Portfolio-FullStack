// frontend2\src\app\sitemap.ts
import { MetadataRoute } from "next";
import { getBootstrap, getProjects, getCreations } from "@/lib/data";
import { normalizeSettingsFromBootstrap } from "@/lib/normalizeSettings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  const bootstrap = await getBootstrap();
  const settings = normalizeSettingsFromBootstrap(bootstrap);

  const urls: MetadataRoute.Sitemap = [];

  // Static pages from settings
  Object.entries(settings.sitemap).forEach(([page, cfg]) => {
    if (!cfg.include) return;

    const pathMap: Record<string, string> = {
      home: "/",
      projects: "/projects",
      creations: "/creations",
      skills: "/#skills",
      services: "/#services",
      experience: "/#experience",
      qualifications: "/#qualifications",
    };

    const path = pathMap[page];
    if (!path) return;

    urls.push({
      url: `${baseUrl}${path}`,
      changeFrequency: cfg.changefreq as "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined,
      priority: cfg.priority,
    });
  });

  // Dynamic: Projects
  const projects = await getProjects();
  projects.forEach((p) =>
    urls.push({
      url: `${baseUrl}/projects/${p.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  // Dynamic: Creations
  const creations = await getCreations();
  creations.forEach((c) =>
    urls.push({
      url: `${baseUrl}/creations/${c.type}/${c.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return urls;
}