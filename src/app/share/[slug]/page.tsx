import { Metadata } from "next";
import { db } from "@/db/firebase";
import { doc, getDoc } from "firebase/firestore";
import { APP } from "@/variables/globals";
import PublicRoadmapView from "@/components/pages/PublicRoadmapView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const q = await getDoc(doc(db, "activities", slug));
    if (q.exists()) {
      const data = q.data();
      if (data.isPublic) {
        return {
          title: `${data.title} | ${APP?.NAME}`,
          description: `A career roadmap for ${data.userInput?.goal || 'professional growth'}`,
        };
      }
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