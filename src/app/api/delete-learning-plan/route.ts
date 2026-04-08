import { NextResponse } from "next/server";
import { db } from "@/db/firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("planId");
    const userId = searchParams.get("userId");

    if (!planId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const planRef = doc(db, "learningPlans", planId);
    const planSnap = await getDoc(planRef);

    if (!planSnap.exists()) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const planData = planSnap.data();

    if (planData.userId !== userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await deleteDoc(planRef);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete plan error:", error);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}