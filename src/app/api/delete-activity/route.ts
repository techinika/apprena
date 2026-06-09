import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/apiAuth";
import { db } from "@/db/firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";

export async function DELETE(req: Request) {
  try {
    const { uid } = await verifyAuth(req);
    const { searchParams } = new URL(req.url);
    const activityId = searchParams.get("activityId");

    if (!activityId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const activityRef = doc(db, "activities", activityId);
    const activitySnap = await getDoc(activityRef);

    if (!activitySnap.exists()) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    const activityData = activitySnap.data();

    if (activityData.userId !== uid) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await deleteDoc(activityRef);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete activity error:", error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}