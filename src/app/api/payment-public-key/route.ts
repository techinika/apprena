import { NextResponse } from "next/server";

export async function GET() {
  try {
    const publicKey = process.env.NEXT_PUBLIC_IREMBOPAY_PUBLIC_KEY || "";
    return NextResponse.json({ publicKey });
  } catch (error) {
    console.error("Error fetching public key:", error);
    return NextResponse.json({ publicKey: "" });
  }
}