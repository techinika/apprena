import { NextResponse } from "next/server";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/db/firebase";

function generateSlug(title: string, id: string): string {
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };
  const titleSlug = slugify(title).slice(0, 50);
  const idSlug = id.slice(0, 8);
  return `${titleSlug}-${idSlug}`;
}

export async function POST(req: Request) {
  try {
    const { activityId, userId, makePublic, tags } = await req.json();

    if (!activityId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const activityRef = doc(db, "activities", activityId);
    const activitySnap = await getDoc(activityRef);

    if (!activitySnap.exists()) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    const activityData = activitySnap.data();

    if (activityData.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const publicSlug = makePublic 
      ? (activityData.slug || generateSlug(activityData.title || "roadmap", activityId))
      : null;

    const updateData: Record<string, any> = {
      isPublic: makePublic,
      publicSlug: publicSlug,
      updatedAt: new Date().toISOString(),
    };

    if (tags && Array.isArray(tags)) {
      updateData.tags = tags;
    }

    await updateDoc(activityRef, updateData);

    return NextResponse.json({
      success: true,
      isPublic: makePublic,
      publicUrl: makePublic ? `/share/${publicSlug}` : null,
      slug: publicSlug,
    });
  } catch (error: any) {
    console.error("Share error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}