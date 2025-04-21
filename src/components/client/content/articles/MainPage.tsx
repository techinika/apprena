"use client";

import { useAuth } from "@/lib/AuthContext";
import React, { useState } from "react";
import AuthNav from "../../navigation/AuthNav";
import Nav from "../../navigation/Nav";
import FooterSection from "@/components/sections/footer/default";
import { Article } from "@/types/Article";
import ArticleCard from "./ArticleCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Loading from "@/app/loading";
import { Sidebar } from "./sidebar";
import { Topic } from "@/types/Discussion";
import { db } from "@/db/firebase";
import { collection, getDoc, onSnapshot, query } from "firebase/firestore";
import { User } from "@/types/Users";

export default function MainPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<(Article | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [topics] = useState<Topic[]>([]);

  React.useEffect(() => {
    setLoading(true);

    const articlesRef = collection(db, "articles");
    const q = query(articlesRef);

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const articlesWithWriters: Article[] = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let writerData: User | null = null;

            if (data.writtenBy) {
              try {
                const writerSnap = await getDoc(data.writtenBy);
                writerData = writerSnap.exists()
                  ? { id: writerSnap.id, ...(writerSnap.data() ?? {}) }
                  : null;
              } catch (err) {
                console.warn("Error fetching writer for article:", err);
              }
            }

            return {
              id: doc.id,
              ...data,
              writtenBy: writerData,
            };
          })
        );

        setArticles(articlesWithWriters);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching articles:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="md:block">
      {user ? <AuthNav /> : <Nav />}
      <div className="size border-t">
        <div className="bg-background">
          <div className="grid lg:grid-cols-5">
            <Sidebar topics={topics} className="hidden lg:block" />
            <div className="col-span-3 lg:col-span-4 lg:border-l">
              <div className="h-full px-4 py-6 lg:px-8">
                <Tabs defaultValue="recent" className="h-full space-y-6">
                  <div className="space-between flex items-center">
                    <TabsList>
                      <TabsTrigger value="recent" className="relative">
                        Recent
                      </TabsTrigger>
                      <TabsTrigger value="popular">Popular</TabsTrigger>
                      <TabsTrigger value="oldest">Oldest</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent
                    value="recent"
                    className="border-none p-0 outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Active Articles & Case Studies
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {`${articles.length} courses available.`}
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-3 gap-3">
                      {articles.length > 0 ? (
                        articles
                          .toSorted((a: Article | null, b: Article | null) => {
                            const dateA = a?.createdAt
                              ? new Date(a?.createdAt).getTime()
                              : new Date().getTime();
                            const dateB = b?.createdAt
                              ? new Date(b?.createdAt).getTime()
                              : new Date().getTime();
                            return dateB - dateA;
                          })
                          .map((item) => {
                            return (
                              <div key={item?.id}>
                                <ArticleCard item={item} />
                              </div>
                            );
                          })
                      ) : (
                        <p>No articles for now! Please check back later.</p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="popular"
                    className="h-full flex-col border-none p-0 data-[state=active]:flex"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Popular Articles
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Articles with a big number of enrollment and upvotes.
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-3 gap-3">
                      {articles.length > 0 ? (
                        articles
                          .toSorted((a, b) => (b?.views ?? 0) - (a?.views ?? 0))
                          .map((item) => {
                            return (
                              <div key={item?.id}>
                                <ArticleCard item={item} />
                              </div>
                            );
                          })
                      ) : (
                        <p>No articles for now! Please check back later.</p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="oldest"
                    className="h-full flex-col border-none p-0 data-[state=active]:flex"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Oldest Articles
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Articles sorted by post date.
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-3 gap-3">
                      {articles.length > 0 ? (
                        articles
                          .toSorted((a, b) => {
                            const dateA = a?.createdAt
                              ? new Date(a?.createdAt).getTime()
                              : new Date().getTime();
                            const dateB = b?.createdAt
                              ? new Date(b?.createdAt).getTime()
                              : new Date().getTime();
                            return dateA - dateB;
                          })
                          .map((item) => {
                            return (
                              <div key={item?.id}>
                                <ArticleCard item={item} />
                              </div>
                            );
                          })
                      ) : (
                        <p>No articles for now! Please check back later.</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
