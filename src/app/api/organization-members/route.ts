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
} from "firebase/firestore";
import { OrganizationMember } from "@/types/organization";

export async function POST(req: Request) {
  try {
    const { organizationId, email, role, invitedBy } = await req.json();

    if (!organizationId || !email || !invitedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orgDoc = await getDoc(doc(db, "organizations", organizationId));
    if (!orgDoc.exists()) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const orgData = orgDoc.data();
    if (orgData.memberCount >= orgData.maxMembers) {
      return NextResponse.json({ error: "Member limit reached" }, { status: 400 });
    }

    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

    const invitationRef = await addDoc(collection(db, "organizationInvitations"), {
      organizationId,
      email,
      role: role || "member",
      invitedBy,
      token,
      status: "pending",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ 
      success: true, 
      invitationId: invitationRef.id,
      token,
    });
  } catch (error: any) {
    console.error("Invite member error:", error);
    return NextResponse.json({ error: "Failed to invite member" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId");

  if (!organizationId) {
    return NextResponse.json({ error: "Missing organizationId" }, { status: 400 });
  }

  try {
    const membersQuery = query(
      collection(db, "organizationMembers"),
      where("organizationId", "==", organizationId),
      where("status", "==", "active")
    );

    const snapshot = await getDocs(membersQuery);
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as OrganizationMember[];

    return NextResponse.json({ members });
  } catch (error: any) {
    console.error("Get members error:", error);
    return NextResponse.json({ error: "Failed to get members" }, { status: 500 });
  }
}
