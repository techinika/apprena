import { NextResponse } from "next/server";

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_IREMBOPAY_PUBLIC_KEY || "";
  
  return NextResponse.json({ publicKey });
}