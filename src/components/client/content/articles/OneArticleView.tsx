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
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomUser } from "@/components/public/discussions/OneDiscussionPage";
import CTA from "@/components/sections/cta/default";

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

        const userRef = docData?.writtenBy as DocumentReference<DocumentData>;
        const topicRef = docData?.category as DocumentReference<DocumentData>;

        let userData: CustomUser | null = null;
        let topicData: DocumentData | null = null;

        try {
          if (userRef) {
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
              userData = {
                id: userSnapshot?.id,
                uid: userSnapshot?.id,
                displayName: userSnapshot.data()?.displayName,
                email: userSnapshot.data().email ?? "",
              };
            }
          }

          if (topicRef) {
            const topicSnapshot = await getDoc(topicRef);
            if (topicSnapshot.exists()) {
              topicData = {
                id: topicSnapshot?.id,
                name: topicSnapshot.data().name,
                createdAt: topicSnapshot.data().createdAt,
              };
            }
          }
        } catch (error) {
          console.error("Error fetching referenced document:", error);
          return null;
        }

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
          institutionOwning: "",
          slug: docData.slug ?? "",
          photoURL: docData?.photoURL,
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

      <div className="mx-auto">
        {article && (
          <>
            <div className="relative w-full h-[40%]">
              <Image
                src={article?.photoURL ?? "/placeholder.jpg"}
                width={1000}
                height={500}
                alt={article.title}
                className="w-full h-96 object-cover shadow-md"
              />

              <div className="absolute inset-0 bg-black bg-opacity-80"></div>

              <div className="size absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
                <h1 className="text-4xl font-bold">{article.title}</h1>
                <p className="text-sm mt-2">
                  Published on {article?.createdAt} by{" "}
                  {article?.writtenBy?.displayName ?? "Unknown"} | Category:{" "}
                  {article?.category?.name ?? "General"}
                </p>
              </div>
            </div>
            <div className="size grid grid-cols-4 items-start gap-4 p-6 m-5">
              <Card className="">
                <CardHeader>
                  <CardTitle>Related Articles</CardTitle>
                </CardHeader>
              </Card>
              <article
                className="prose col-span-3 leading-normal article-content"
                dangerouslySetInnerHTML={{
                  __html: article?.content || "<p>No content available.</p>",
                }}
              />
            </div>
          </>
        )}
      </div>
      {!user && <CTA />}
      <FooterSection />
    </div>
  );
}

export default OneArticleView;
