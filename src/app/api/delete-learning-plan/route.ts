import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/apiAuth";
import { db } from "@/db/firebase";
import { doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";

export async function DELETE(req: Request) {
  try {
    const { uid } = await verifyAuth(req);
    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("planId");

    if (!planId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const planRef = doc(db, "learningPlans", planId);
    const planSnap = await getDoc(planRef);

    if (!planSnap.exists()) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const planData = planSnap.data();

    if (planData.userId !== uid) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const parentActivityId = planData.parentActivityId;
    if (parentActivityId) {
      const activityRef = doc(db, "activities", parentActivityId);
      const activitySnap = await getDoc(activityRef);
      if (activitySnap.exists()) {
        const activityData = activitySnap.data();
        const currentLinks = activityData.linkedLearningPlanIds || [];
        await updateDoc(activityRef, {
          linkedLearningPlanIds: currentLinks.filter((id: string) => id !== planId),
        });
      }
    }

    await deleteDoc(planRef);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete plan error:", error);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}