import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/apiAuth";
import { getSubscriptionStatus, hasActiveSubscription } from "@/db/operations/CreditCheck";

export async function GET(req: Request) {
  try {
    const { uid } = await verifyAuth(req);
    const userId = uid;

    const hasActive = await hasActiveSubscription(userId);
    const status = await getSubscriptionStatus(userId);

    return NextResponse.json({
      hasActiveSubscription: hasActive,
      ...status,
    });
  } catch (error: any) {
    console.error("Subscription check error:", error);
    return NextResponse.json({ error: "Failed to check subscription" }, { status: 500 });
  }
}