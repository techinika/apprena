import OneDiscussionPage from "@/components/public/discussions/OneDiscussionPage";
import { db } from "@/db/firebase";
import { APP } from "@/variables/globals";
import { doc, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const discussionRef = doc(db, "discussions", id);
  const snapshot = await getDoc(discussionRef);

  if (!snapshot.exists()) {
    return {
      title: "Discussion Not Found | APPRENA",
      description:
        "This discussion could not be found. Browse other discussions or ask your own on APPRENA.",
    };
  }

  const data = snapshot.data();
  const title = data?.title ?? "Discussion on APPRENA";
  const description =
    data?.description ??
    "Join this discussion on APPRENA to share insights and learn from others.";
  const createdBy = data?.createdBy?.displayName ?? "Anonymous";

  return {
    title: `${title} | APPRENA Forum Discussions`,
    description,
    keywords: [
      title,
      "APPRENA discussion",
      "education community",
      "learning questions",
      "L&D collaboration",
      "training feedback",
      "professional development Q&A",
      ...(Array.isArray(data?.tags) ? data.tags : []),
    ],
    openGraph: {
      title: `${title} | APPRENA Forum Discussions`,
      description,
      url: `https://apprena.app/discussions/${id}`,
      siteName: APP?.NAME,
      type: "article",
    },
    authors: [{ name: createdBy }],
  };
}

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <OneDiscussionPage discussionId={id} />
    </div>
  );
}

export default page;
