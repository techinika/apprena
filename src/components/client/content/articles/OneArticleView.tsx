"use client";

import React, { useEffect, useState } from "react";
import AuthNav from "../../navigation/AuthNav";
import Nav from "../../navigation/Nav";
import { useAuth } from "@/lib/AuthContext";
import FooterSection from "@/components/sections/footer/default";
import { Article } from "@/types/Article";
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";
import Loading from "@/app/loading";
import Image from "next/image";

function OneArticleView({ slug }: { slug: string | TrustedHTML }) {
  const { user } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<Article>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        const articleRef = doc(db, "articles", slug as string);
        const articleSnap = await getDoc(articleRef);

        if (!articleSnap.exists()) {
          router.push("/articles");
          return;
        }

        const docData = articleSnap.data();
        if (!docData) {
          console.warn("No data in article doc.");
          return;
        }

        // Get refs
        const userRef = docData.createdBy as
          | DocumentReference<DocumentData>
          | undefined;
        const topicRef = docData.topic as
          | DocumentReference<DocumentData>
          | undefined;

        // Fetch user and topic in parallel
        const [userSnap, topicSnap] = await Promise.all([
          userRef ? getDoc(userRef) : Promise.resolve(null),
          topicRef ? getDoc(topicRef) : Promise.resolve(null),
        ]);

        const userData = userSnap?.exists()
          ? {
              id: userSnap.id,
              uid: userSnap.id,
              displayName: userSnap.data()?.displayName ?? "",
              email: userSnap.data()?.email ?? "",
            }
          : null;

        const topicData = topicSnap?.exists()
          ? {
              id: topicSnap.id,
              name: topicSnap.data()?.name ?? "",
              createdAt: topicSnap.data()?.createdAt,
            }
          : null;

        // Set state
        setArticle({
          id: articleSnap.id,
          category: topicData
            ? {
                id: topicData.id,
                name: topicData.name,
                createdAt: formatDistance(
                  topicData.createdAt?.toDate?.() ?? new Date(),
                  new Date(),
                  { includeSeconds: true }
                ),
              }
            : null,
          createdAt: formatDistance(
            docData.createdAt?.toDate?.() ?? new Date(),
            new Date(),
            { includeSeconds: true }
          ),
          writtenBy: userData,
          content: docData.content ?? "",
          title: docData.title ?? "",
          status: docData.status ?? "",
          summary: docData.description ?? "",
          views: docData.views ?? 0,
          availability: docData.availability ?? "public",
          institutionOwning: "", // populate if needed
          slug: docData.slug ?? "",
        });
      } catch (error) {
        console.error("Error fetching article data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen">
      {user ? <AuthNav /> : <Nav />}

      <div className="mx-auto shadow-md rounded-lg p-6">
        {article && (
          <>
            <div className="relative w-full h-[30%]">
              <Image
                src={article?.photoURL ?? "/placeholder.jpg"}
                width={1000}
                height={500}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />

              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>

              <div className="size absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
                <h1 className="text-4xl font-bold">{article.title}</h1>
                <p className="text-sm mt-2">
                  Published on {article?.createdAt} | Category:{" "}
                  {article?.category?.name}
                </p>
              </div>
            </div>
            <article
              className="size mt-6 text-lg leading-relaxed article-content"
              dangerouslySetInnerHTML={{
                __html: article?.content || "<p>No content available.</p>",
              }}
            />
          </>
        )}
      </div>
      <FooterSection />
    </div>
  );
}

export default OneArticleView;
