import { MetadataRoute } from "next";
import { BASE_URL } from "@/variables/globals";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = BASE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/workspace/", "/learning/", "/api/", "/organization/", "/invitation/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
