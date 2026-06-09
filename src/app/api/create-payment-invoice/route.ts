import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/apiAuth";
import { db } from "@/db/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { createInvoice } from "@/lib/payments";

export async function POST(req: Request) {
  try {
    const { uid } = await verifyAuth(req);
    const { orderIds, amount, customer } = await req.json();

    if (!orderIds || orderIds.length === 0 || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transactionId = `PAY-${Date.now()}`;
    const description = orderIds.length === 1 
      ? `Payment for order ${orderIds[0]}` 
      : `Payment for ${orderIds.length} orders`;

    const irembopayInvoice = await createInvoice({
      transactionId,
      amount,
      description,
      customer,
      expiryDays: 7,
    });

    const invoiceRef = await addDoc(collection(db, "paymentInvoices"), {
      orderIds,
      invoiceNumber: irembopayInvoice.invoiceNumber,
      paymentLinkUrl: irembopayInvoice.paymentLinkUrl,
      amount: irembopayInvoice.amount,
      currency: irembopayInvoice.currency,
      status: "pending",
      customer,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      invoiceId: invoiceRef.id,
      invoiceNumber: irembopayInvoice.invoiceNumber,
      paymentLinkUrl: irembopayInvoice.paymentLinkUrl,
    });
  } catch (error: any) {
    console.error("Create payment invoice error:", error);
    return NextResponse.json({ error: error.message || "Failed to create invoice" }, { status: 500 });
  }
}
