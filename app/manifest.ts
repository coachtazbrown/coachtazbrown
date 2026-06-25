import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#06060F",
    theme_color: "#06060F",
    icons: [
      { src: "/icon", sizes: "any", type: "image/png" }
    ]
  };
}
