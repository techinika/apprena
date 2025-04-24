import OneArticleView from "@/components/client/content/articles/OneArticleView";
import { db } from "@/db/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const articleRef = doc(db, "articles", slug);
  const snapshot = await getDoc(articleRef);

  if (!snapshot.exists()) {
    return {
      title: "Article Not Found | APPRENA",
      description:
        "This article could not be found. Browse our insights, or discover learning resources on APPRENA.",
    };
  }

  const data = snapshot.data();
  const title = data?.title ?? "Article on APPRENA";
  const description =
    data?.description ??
    "Explore this article on education, skills, and learning at APPRENA.";
  const authorName = data?.authorName ?? "APPRENA Team";
  const coverImage = data?.coverImage ?? "https://apprena.app/white-logo.png";

  return {
    title: `${title} | APPRENA Articles`,
    description,
    keywords: [
      title,
      "APPRENA articles",
      "educational content",
      "learning resources",
      "digital skills",
      "professional development",
      "Rwanda eLearning",
      ...(Array.isArray(data?.tags) ? data.tags : []),
    ],
    openGraph: {
      title: `${title} | APPRENA Articles`,
      description,
      url: `https://apprena.app/articles/${slug}`,
      siteName: "APPRENA",
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
    },
    authors: [{ name: authorName }],
  };
}

async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <OneArticleView slug={slug} />
    </div>
  );
}

export default page;
