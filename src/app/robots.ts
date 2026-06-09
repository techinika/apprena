import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://apprena.techinika.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/workspace/", "/learning/", "/api/", "/organization/", "/invitation/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
