import { NextResponse } from "next/server";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/db/firebase";

export async function POST(req: Request) {
  try {
    const { activityId, userId, makePublic } = await req.json();

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

    const publicSlug = makePublic ? activityId : null;

    await updateDoc(activityRef, {
      isPublic: makePublic,
      publicSlug: publicSlug,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      isPublic: makePublic,
      publicUrl: makePublic ? `/share/${activityId}` : null,
    });
  } catch (error: any) {
    console.error("Share error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}