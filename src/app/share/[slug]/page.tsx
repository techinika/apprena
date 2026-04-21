import { Metadata } from "next";
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
      return { id: q.id, ...q.data() };
    }
  } catch (e) {
    console.error("Error fetching by ID:", e);
  }

  try {
    const q = query(collection(db, "activities"), where("publicSlug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      if (docSnap.data().isPublic) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    }
  } catch (e) {
    console.error("Error fetching by slug:", e);
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const activity = await findActivityBySlug(slug);
    
    if (activity) {
      const title = activity.title || "Career Roadmap";
      const goal = activity.userInput?.goal || "professional growth";
      const tags = activity.tags || [];
      const description = `A comprehensive career roadmap for achieving ${goal}. Includes learning path, habits, and network recommendations. Created with Apprena AI.`;
      
      return {
        title: `${title} | ${APP?.NAME}`,
        description: description,
        keywords: ["career roadmap", "professional development", "career planning", ...tags, "Apprena"].filter(Boolean),
        openGraph: {
          title: `${title} | ${APP?.NAME}`,
          description: description,
          type: "article",
          publishedTime: activity.createdAt,
          tags: tags,
        },
        twitter: {
          card: "summary_large_image",
          title: `${title} | ${APP?.NAME}`,
          description: description,
        },
      };
    }
  } catch (e) {
    console.error("Metadata error:", e);
  }
  
  return { title: "Not Found" };
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  
  return <PublicRoadmapView slug={slug} />;
}