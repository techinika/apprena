import { NextResponse } from "next/server";
import { db } from "@/db/firebase";
import { doc, updateDoc, getDoc, collection, query, where, getDocs, serverTimestamp, writeBatch } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.PAYMENT_CALLBACK_SECRET;
    if (webhookSecret) {
      const requestSecret = req.headers.get("x-webhook-secret");
      if (requestSecret !== webhookSecret) {
        console.error("Payment callback: invalid webhook secret");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();

    if (!body.success || body.data?.paymentStatus !== "PAID") {
      return NextResponse.json({ received: true });
    }

    const paymentData = body.data;
    const invoiceNumber = paymentData.invoiceNumber;

    const invoicesQuery = await getDoc(doc(db, "organizationInvoices", invoiceNumber));
    
    if (invoicesQuery.exists()) {
      const invoiceData = invoicesQuery.data();
      const organizationId = invoiceData.organizationId;

      await updateDoc(doc(db, "organizationInvoices", invoiceNumber), {
        status: "paid",
        paidAt: serverTimestamp(),
        paymentMethod: paymentData.paymentMethod,
        paymentReference: paymentData.paymentReference,
      });

      await updateDoc(doc(db, "organizations", organizationId), {
        isActive: true,
        pendingInvoiceId: null,
        "subscription.status": "active",
        "subscription.currentPeriodStart": serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (invoiceData.userId) {
        const membersQuery = await getDoc(
          doc(db, "organizationMembers", `${organizationId}_${invoiceData.userId}`)
        );
        
        if (membersQuery.exists()) {
          await updateDoc(doc(db, "organizationMembers", membersQuery.id), {
            status: "active",
          });
        }
      }
    }

    const paymentInvoicesQuery = query(
      collection(db, "paymentInvoices"),
      where("invoiceNumber", "==", invoiceNumber),
      where("status", "==", "pending")
    );
    const paymentInvoicesSnap = await getDocs(paymentInvoicesQuery);

    if (!paymentInvoicesSnap.empty) {
      const paymentInvoice = paymentInvoicesSnap.docs[0];
      const paymentInvoiceData = paymentInvoice.data();
      const orderIds: string[] = paymentInvoiceData.orderIds || [];

      const batch = writeBatch(db);

      batch.update(paymentInvoice.ref, {
        status: "paid",
        paidAt: serverTimestamp(),
        paymentMethod: paymentData.paymentMethod,
        paymentReference: paymentData.paymentReference,
      });

      for (const orderId of orderIds) {
        const orderRef = doc(db, "orders", orderId);
        batch.update(orderRef, {
          status: "activated",
          paidAt: serverTimestamp(),
        });

        const txRef = doc(collection(db, "transactions"));
        batch.set(txRef, {
          orderId,
          amount: paymentData.amount,
          method: paymentData.paymentMethod,
          status: "success",
          timestamp: serverTimestamp(),
        });

        const orderQuery = query(collection(db, "orders"), where("__name__", "==", orderId));
        const orderSnap = await getDocs(orderQuery);
        
        if (!orderSnap.empty) {
          const orderData = orderSnap.docs[0].data();
          const userId = orderData.userId;
          const planId = orderData.planId;

          const profileRef = doc(db, "profiles", userId);
          if (planId === "sprint") {
            batch.update(profileRef, {
              accountType: "pro",
              purchasedCredits: 1,
            });
          } else if (planId === "architect") {
            const now = new Date();
            const endDate = new Date(now);
            endDate.setDate(endDate.getDate() + 30);

            const subRef = doc(collection(db, "subscriptions"));
            batch.set(subRef, {
              userId,
              orderId,
              status: "active",
              planId: "architect",
              startDate: now,
              endDate: endDate,
              createdAt: serverTimestamp(),
            });

            batch.update(profileRef, { 
              accountType: "architect",
              subscriptionEndDate: endDate,
            });
          }
        }
      }

      await batch.commit();
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}