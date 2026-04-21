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
import { OrganizationTemplate } from "@/types/organization";

export async function POST(req: Request) {
  try {
    const { organizationId, name, description, category, roadmap, learningModules, createdBy, isPublic } = await req.json();

    if (!organizationId || !name || !roadmap || !createdBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const templateRef = await addDoc(collection(db, "organizationTemplates"), {
      organizationId,
      name,
      description: description || "",
      category: category || "general",
      roadmap,
      learningModules: learningModules || [],
      createdBy,
      isPublic: isPublic || false,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ 
      success: true, 
      templateId: templateRef.id 
    });
  } catch (error: any) {
    console.error("Create template error:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId");
  const templateId = searchParams.get("templateId");

  try {
    if (templateId) {
      const docSnap = await getDoc(doc(db, "organizationTemplates", templateId));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 });
      }
      return NextResponse.json({ template: { id: docSnap.id, ...docSnap.data() } });
    }

    if (organizationId) {
      const q = query(
        collection(db, "organizationTemplates"),
        where("organizationId", "==", organizationId)
      );
      const snapshot = await getDocs(q);
      const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json({ templates });
    }

    const publicQ = query(
      collection(db, "organizationTemplates"),
      where("isPublic", "==", true)
    );
    const publicSnapshot = await getDocs(publicQ);
    const templates = publicSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ templates });

  } catch (error: any) {
    console.error("Get templates error:", error);
    return NextResponse.json({ error: "Failed to get templates" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { templateId, ...updates } = await req.json();

    if (!templateId) {
      return NextResponse.json({ error: "Missing templateId" }, { status: 400 });
    }

    await updateDoc(doc(db, "organizationTemplates", templateId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update template error:", error);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const templateId = searchParams.get("templateId");

  if (!templateId) {
    return NextResponse.json({ error: "Missing templateId" }, { status: 400 });
  }

  try {
    const templateDoc = await getDoc(doc(db, "organizationTemplates", templateId));
    if (!templateDoc.exists()) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    await deleteDoc(doc(db, "organizationTemplates", templateId));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete template error:", error);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}