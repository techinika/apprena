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
} from "firebase/firestore";
import { OrganizationMember } from "@/types/organization";
import { sendInvitationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { uid } = await verifyAuth(req);
    const { organizationId, email, role, invitedUserId } = await req.json();

    if (!organizationId || !email) {
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

    let linkedUserId = invitedUserId;
    if (!linkedUserId) {
      const userQuery = query(collection(db, "profiles"), where("email", "==", email.toLowerCase()));
      const userSnap = await getDocs(userQuery);
      if (!userSnap.empty) {
        linkedUserId = userSnap.docs[0].id;
      }
    }

    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

    const invitationRef = await addDoc(collection(db, "organizationInvitations"), {
      organizationId,
      email: email.toLowerCase(),
      invitedUserId: linkedUserId || null,
      role: role || "member",
      invitedBy: uid,
      token,
      status: "pending",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: serverTimestamp(),
    });

    const inviterDoc = await getDoc(doc(db, "profiles", uid));
    const inviterName = inviterDoc.exists() 
      ? inviterDoc.data().displayName || inviterDoc.data().email?.split("@")[0] 
      : "Someone";

    const emailResult = await sendInvitationEmail(email, orgData.name, inviterName, token);
    if (!emailResult.success) {
      console.warn("Invitation email failed to send:", emailResult.error);
    }

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

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");

  if (!memberId) {
    return NextResponse.json({ error: "Missing memberId" }, { status: 400 });
  }

  try {
    const { uid } = await verifyAuth(req);
    const memberDoc = await getDoc(doc(db, "organizationMembers", memberId));
    if (!memberDoc.exists()) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const memberData = memberDoc.data();
    const orgDoc = await getDoc(doc(db, "organizations", memberData.organizationId));
    if (!orgDoc.exists()) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const orgData = orgDoc.data();
    await deleteDoc(doc(db, "organizationMembers", memberId));

    await updateDoc(doc(db, "organizations", memberData.organizationId), {
      memberCount: Math.max(0, (orgData.memberCount || 1) - 1),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete member error:", error);
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId");

  if (!organizationId) {
    return NextResponse.json({ error: "Missing organizationId" }, { status: 400 });
  }

  try {
    const { uid } = await verifyAuth(req);
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
