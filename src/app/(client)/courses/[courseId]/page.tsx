import CoursePage from "@/components/client/content/courses/OneCourse/CoursePage";
import { db } from "@/db/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;

  const articleRef = doc(db, "courses", courseId);
  const snapshot = await getDoc(articleRef);

  if (!snapshot.exists()) {
    return {
      title: "Course Not Found | APPRENA",
      description:
        "This course could not be found. Browse our insights, or discover learning resources on APPRENA.",
    };
  }

  const data = snapshot.data();
  const title = data?.title ?? "Course on APPRENA";
  const description =
    data?.description ??
    "Explore this course on education, skills, and learning at APPRENA.";
  const coverImage = data?.coverImage ?? "https://apprena.app/white-logo.png";

  return {
    title: `${title} | APPRENA Courses`,
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
      title: `${title} | APPRENA Courses`,
      description,
      url: `https://apprena.app/courses/${courseId}`,
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
  };
}

async function page({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return (
    <div>
      <CoursePage id={courseId} />
    </div>
  );
}

export default page;
