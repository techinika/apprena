import { NextResponse } from "next/server";
import { getSubscriptionStatus, hasActiveSubscription } from "@/db/operations/CreditCheck";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

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