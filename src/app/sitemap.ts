import { db } from "@/db/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const discussionsRef = collection(db, "discussions");
  const snapshot = await getDocs(discussionsRef);
  const articlesRef = collection(db, "articles");
  const q = query(articlesRef, where("status", "==", "published"));

  const articlesSnapshot = await getDocs(q);

  const discussionLinks: MetadataRoute.Sitemap = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      url: `${BASE_URL}/discussions/${doc?.id}`,
      lastModified:
        data.updatedAt?.toDate?.().toISOString?.() ?? new Date().toISOString(),
      changeFrequency: "always",
      priority: 0.7,
    };
  });

  const articleLinks: MetadataRoute.Sitemap = articlesSnapshot.docs.map(
    (doc) => {
      const data = doc.data();
      return {
        url: `${BASE_URL}/articles/${doc?.id}`,
        lastModified:
          data.updatedAt?.toDate?.().toISOString?.() ??
          new Date().toISOString(),
        changeFrequency: "always" as const,
        priority: 0.7,
        ...(data.coverImage && { images: [data.coverImage] }),
      };
    }
  );

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/history`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/discussions`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/discussions/ask`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/courses`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/training`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/start`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    ...discussionLinks,
    ...articleLinks,
  ];
}
