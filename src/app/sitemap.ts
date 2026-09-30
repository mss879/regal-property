import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { VILLAS } from "@/lib/lots";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/villas", "/brochure", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...VILLAS.map((v) => ({ url: `${SITE.url}/villas/${v.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
  ];
}
