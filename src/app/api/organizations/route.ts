import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/apiAuth";
import { db } from "@/db/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { Organization, OrganizationMember, OrganizationInvoice, MemberPermissions } from "@/types/organization";
import { createInvoice } from "@/lib/payments";

const TIER_PRICES: Record<string, { monthly: number; annual: number }> = {
  "team-starter": { monthly: 24000, annual: 240000 },
  "team-growth": { monthly: 40000, annual: 400000 },
  "team-enterprise": { monthly: 80000, annual: 800000 },
};

function getMaxMembers(tierId: string): number {
  const tierMembers: Record<string, number> = {
    "team-starter": 5,
    "team-growth": 15,
    "team-enterprise": 9999,
  };
  return tierMembers[tierId] || 5;
}

export async function POST(req: Request) {
  try {
    const { uid } = await verifyAuth(req);
    const { name, tierId, billingCycle = "monthly", userEmail, userName } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tierInfo = TIER_PRICES[tierId] || TIER_PRICES["team-starter"];
    const amountRwf = billingCycle === "annual" ? tierInfo.annual : tierInfo.monthly;
    const maxMembers = getMaxMembers(tierId);

    const orgRef = await addDoc(collection(db, "organizations"), {
      name,
      ownerId: uid,
      memberCount: 1,
      maxMembers,
      subscription: {
        tierId: tierId || "team-starter",
        status: "trial",
        billingCycle,
        currentPeriodStart: serverTimestamp(),
        currentPeriodEnd: null,
        autoRenew: true,
      },
      settings: {
        allowMemberRoadmaps: true,
        requireApproval: true,
      },
      isActive: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    let invoiceNumber = "";
    let paymentLinkUrl = "";
    
    try {
      const irembopayInvoice = await createInvoice({
        transactionId: `ORG-${orgRef.id}-${Date.now()}`,
        amount: amountRwf,
        description: `Organization Subscription - ${name} - ${tierId}`,
        customer: {
          email: userEmail,
          name: userName,
        },
        expiryDays: 7,
      });
      invoiceNumber = irembopayInvoice.invoiceNumber;
      paymentLinkUrl = irembopayInvoice.paymentLinkUrl;
    } catch (invoiceError) {
      console.error("Failed to create IremboPay invoice:", invoiceError);
    }

    const invoiceRef = await addDoc(collection(db, "organizationInvoices"), {
      organizationId: orgRef.id,
      userId: uid,
      amount: amountRwf,
      amountRwf,
      currency: "RWF",
      status: "pending",
      billingCycle,
      tierId: tierId || "team-starter",
      invoiceNumber: invoiceNumber || `INV-${Date.now()}`,
      paymentLinkUrl,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    await updateDoc(doc(db, "organizations", orgRef.id), {
      pendingInvoiceId: invoiceRef.id,
    });

    await addDoc(collection(db, "organizationMembers"), {
      organizationId: orgRef.id,
      userId: uid,
      role: "owner",
      status: "pending",
      permissions: {
        canCreateRoadmaps: true,
        canEditOwnRoadmaps: true,
        canViewAllRoadmaps: true,
        canInviteMembers: true,
        canManageBilling: true,
      },
      joinedAt: serverTimestamp(),
    });

    return NextResponse.json({ 
      success: true, 
      organizationId: orgRef.id,
      invoiceId: invoiceRef.id,
      amountRwf,
    });
  } catch (error: any) {
    console.error("Create organization error:", error);
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { uid } = await verifyAuth(req);
    const userId = uid;
    const memberQuery = query(
      collection(db, "organizationMembers"),
      where("userId", "==", userId),
      where("status", "==", "active")
    );

    const memberSnapshot = await getDocs(memberQuery);
    const orgs: Organization[] = [];

    for (const memDoc of memberSnapshot.docs) {
      const memData = memDoc.data();
      const orgDoc = await getDoc(doc(db, "organizations", memData.organizationId));
      if (orgDoc.exists()) {
        orgs.push({ id: orgDoc.id, ...orgDoc.data() } as Organization);
      }
    }

    return NextResponse.json({ organizations: orgs });
  } catch (error: any) {
    console.error("Get organizations error:", error);
    return NextResponse.json({ error: "Failed to get organizations" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId");

  if (!organizationId) {
    return NextResponse.json({ error: "Missing organizationId" }, { status: 400 });
  }

  try {
    const { uid } = await verifyAuth(req);
    const orgDoc = await getDoc(doc(db, "organizations", organizationId));
    if (!orgDoc.exists()) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const orgData = orgDoc.data();
    if (orgData.ownerId !== uid) {
      return NextResponse.json({ error: "Only the owner can delete this organization" }, { status: 403 });
    }

    const membersQuery = query(
      collection(db, "organizationMembers"),
      where("organizationId", "==", organizationId)
    );
    const membersSnapshot = await getDocs(membersQuery);
    for (const memberDoc of membersSnapshot.docs) {
      await deleteDoc(doc(db, "organizationMembers", memberDoc.id));
    }

    const templatesQuery = query(
      collection(db, "organizationTemplates"),
      where("organizationId", "==", organizationId)
    );
    const templatesSnapshot = await getDocs(templatesQuery);
    for (const templateDoc of templatesSnapshot.docs) {
      await deleteDoc(doc(db, "organizationTemplates", templateDoc.id));
    }

    const invitationsQuery = query(
      collection(db, "organizationInvitations"),
      where("organizationId", "==", organizationId)
    );
    const invitationsSnapshot = await getDocs(invitationsQuery);
    for (const invDoc of invitationsSnapshot.docs) {
      await deleteDoc(doc(db, "organizationInvitations", invDoc.id));
    }

    await deleteDoc(doc(db, "organizations", organizationId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete organization error:", error);
    return NextResponse.json({ error: "Failed to delete organization" }, { status: 500 });
  }
}