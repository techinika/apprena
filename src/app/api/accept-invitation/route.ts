import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/apiAuth";
import { db } from "@/db/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { sendEmail } from "@/lib/email";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const { uid } = await verifyAuth(req);
    const invitationQuery = query(
      collection(db, "organizationInvitations"),
      where("token", "==", token),
      where("status", "==", "pending")
    );

    const snapshot = await getDocs(invitationQuery);

    if (snapshot.empty) {
      return NextResponse.json({ error: "Invitation not found or already used" }, { status: 404 });
    }

    const invitationDoc = snapshot.docs[0];
    const invitationData = invitationDoc.data();

    if (new Date(invitationData.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Invitation expired" }, { status: 400 });
    }

    const orgDoc = await getDoc(doc(db, "organizations", invitationData.organizationId));
    if (!orgDoc.exists()) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const orgData = orgDoc.data();

    return NextResponse.json({
      organizationId: invitationData.organizationId,
      orgName: orgData.name,
      email: invitationData.email,
      role: invitationData.role,
    });
  } catch (error: any) {
    console.error("Get invitation error:", error);
    return NextResponse.json({ error: "Failed to get invitation" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { uid } = await verifyAuth(req);
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const invitationQuery = query(
      collection(db, "organizationInvitations"),
      where("token", "==", token),
      where("status", "==", "pending")
    );

    const snapshot = await getDocs(invitationQuery);

    if (snapshot.empty) {
      return NextResponse.json({ error: "Invitation not found or already used" }, { status: 404 });
    }

    const invitationDoc = snapshot.docs[0];
    const invitationData = invitationDoc.data();

    if (invitationData.invitedUserId && invitationData.invitedUserId !== uid) {
      return NextResponse.json({ error: "This invitation was not sent to you" }, { status: 403 });
    }

    const invitedProfile = await getDoc(doc(db, "profiles", uid));
    if (!invitedProfile.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userEmail = invitedProfile.data().email?.toLowerCase();
    const invitationEmail = invitationData.email?.toLowerCase();
    
    if (invitationData.email && userEmail !== invitationEmail) {
      return NextResponse.json({ error: "This invitation was not sent to you" }, { status: 403 });
    }

    if (new Date(invitationData.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Invitation expired" }, { status: 400 });
    }

    const orgDoc = await getDoc(doc(db, "organizations", invitationData.organizationId));
    if (!orgDoc.exists()) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const orgData = orgDoc.data();

    if (orgData.memberCount >= orgData.maxMembers) {
      return NextResponse.json({ error: "Organization member limit reached" }, { status: 400 });
    }

    await updateDoc(invitationDoc.ref, {
      status: "accepted",
      userId: uid,
      acceptedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "organizationMembers"), {
      organizationId: invitationData.organizationId,
      userId: uid,
      role: invitationData.role,
      status: "active",
      permissions: {
        canCreateRoadmaps: true,
        canEditOwnRoadmaps: true,
        canViewAllRoadmaps: true,
        canInviteMembers: invitationData.role === "admin" || invitationData.role === "owner",
        canManageBilling: false,
      },
      joinedAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "organizations", invitationData.organizationId), {
      memberCount: orgData.memberCount + 1,
      updatedAt: serverTimestamp(),
    });

    const inviterDoc = await getDoc(doc(db, "profiles", invitationData.invitedBy));
    const inviterName = inviterDoc.exists() 
      ? (inviterDoc.data().displayName || inviterDoc.data().email?.split("@")[0] || "Someone")
      : "Someone";

    const emailResult = await sendEmail(
      invitationData.email,
      `Welcome to ${orgData.name}!`,
      `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Welcome to ${orgData.name}!</h2>
        <p>${inviterName} has been notified that you joined ${orgData.name}.</p>
        <p>You can now access the organization dashboard.</p>
      </div>`
    );
    if (!emailResult.success) {
      console.warn("Welcome email failed to send:", emailResult.error);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Accept invitation error:", error);
    return NextResponse.json({ error: "Failed to accept invitation" }, { status: 500 });
  }
}