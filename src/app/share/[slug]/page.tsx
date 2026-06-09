import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db/firebase";
import { doc, getDoc, query, where, getDocs, collection } from "firebase/firestore";
import { APP } from "@/variables/globals";
import PublicRoadmapView from "@/components/pages/PublicRoadmapView";

interface Props {
  params: Promise<{ slug: string }>;
}

async function findActivityBySlug(slug: string) {
  try {
    const q = await getDoc(doc(db, "activities", slug));
    if (q.exists() && q.data().isPublic) {
      return { id: q.id, ...q.data() } as {
        id: string;
        title?: string;
        userInput?: { goal?: string };
        tags?: string[];
        isPublic?: boolean;
        createdAt?: string;
      };
    }
  } catch {
    // fall through to slug query
  }

  try {
    const q = query(collection(db, "activities"), where("publicSlug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      if (docSnap.data().isPublic) {
        return { id: docSnap.id, ...docSnap.data() } as {
          id: string;
          title?: string;
          userInput?: { goal?: string };
          tags?: string[];
          isPublic?: boolean;
          createdAt?: string;
        };
      }
    }
  } catch {
    // not found
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://apprena.techinika.com";

  try {
    const activity = await findActivityBySlug(slug);

    if (!activity) return {};

    const title = activity.title || "Career Roadmap";
    const goal = activity.userInput?.goal || "professional growth";
    const tags = activity.tags || [];
    const description = `A comprehensive career roadmap for achieving ${goal}. Includes learning path, habits, and network recommendations. Created with Apprena AI.`;
    const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

    return {
      title: `${title} | ${APP?.NAME}`,
      description,
      keywords: [
        "career roadmap",
        "professional development",
        "career planning",
        ...tags,
        "Apprena",
      ].filter(Boolean),
      alternates: {
        canonical: `${baseUrl}/share/${slug}`,
      },
      openGraph: {
        title: `${title} | ${APP?.NAME}`,
        description,
        url: `${baseUrl}/share/${slug}`,
        type: "article",
        publishedTime: activity.createdAt,
        tags,
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ${APP?.NAME}`,
        description,
        images: [ogImageUrl],
      },
    };
  } catch {
    return {};
  }
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  const activity = await findActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  return <PublicRoadmapView slug={slug} />;
}
