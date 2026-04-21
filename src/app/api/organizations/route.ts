import { NextResponse } from "next/server";
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
import { Organization, OrganizationMember, MemberPermissions } from "@/types/organization";

export async function POST(req: Request) {
  try {
    const { userId, name, tierId } = await req.json();

    if (!userId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const maxMembers = getMaxMembers(tierId);

    const orgRef = await addDoc(collection(db, "organizations"), {
      name,
      ownerId: userId,
      memberCount: 1,
      maxMembers,
      subscription: {
        tierId: tierId || "team-starter",
        status: "trial",
        billingCycle: "monthly",
        currentPeriodStart: serverTimestamp(),
        currentPeriodEnd: null,
        autoRenew: true,
      },
      settings: {
        allowMemberRoadmaps: true,
        requireApproval: true,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "organizationMembers"), {
      organizationId: orgRef.id,
      userId,
      role: "owner",
      status: "active",
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
      organizationId: orgRef.id 
    });
  } catch (error: any) {
    console.error("Create organization error:", error);
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
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

function getMaxMembers(tierId: string): number {
  const tierMembers: Record<string, number> = {
    "team-starter": 5,
    "team-growth": 15,
    "team-enterprise": 9999,
  };
  return tierMembers[tierId] || 5;
}