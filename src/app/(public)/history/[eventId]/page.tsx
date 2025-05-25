import OneEvent from "@/components/public/history/OneEvent";
import { db } from "@/db/firebase";
import { APP } from "@/variables/globals";
import { doc, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;

  const itemRef = doc(db, "historyEvents", eventId);
  const snapshot = await getDoc(itemRef);

  if (!snapshot.exists()) {
    return {
      title: "History Event Not Found | APPRENA",
      description:
        "This event could not be found. Browse other events or ask your own on APPRENA.",
    };
  }

  const data = snapshot.data();
  const title = data?.title ?? "History Events on APPRENA";
  const description =
    data?.description ??
    "Join this event on APPRENA to share insights and learn from others.";
  const createdBy = data?.createdBy?.displayName ?? "Anonymous";

  return {
    title: `${title} | APPRENA History Events`,
    description,
    keywords: [
      title,
      "APPRENA history events",
      "today in history",
      "historical milestones",
      "learning from history",
      "historical events",
      "what happened today",
      "on this day",
      "what happened in history",
      "historical anniversaries",
      "historical significance",
      ...(Array.isArray(data?.seo) ? data.seo : []),
    ],
    openGraph: {
      title: `${title} | APPRENA Forum Discussions`,
      description,
      url: `https://apprena.app/history/${eventId}`,
      siteName: APP?.NAME,
      type: "article",
    },
    authors: [{ name: createdBy }],
  };
}

async function page({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;

  return (
    <div>
      <OneEvent eventId={eventId} />
    </div>
  );
}

export default page;
