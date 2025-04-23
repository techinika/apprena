"use client";

import { Metadata } from "next";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "@/lib/AuthContext";
import AuthNav from "@/components/client/navigation/AuthNav";
import Nav from "@/components/client/navigation/Nav";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import DiscussionCard from "./DiscussionCard";
import { Discussion, Topic } from "@/types/Discussion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  collection,
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import FooterSection from "@/components/sections/footer/default";

export const metadata: Metadata = {
  title: "Community Discussions",
  description: "Example music app using the components.",
};

export default function MainPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<(Discussion | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const topicCollection = collection(db, "topics");
      const discussionCollection = collection(db, "discussions");
      const q = query(topicCollection);
      const qd = query(discussionCollection, where("status", "==", "approved"));
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
          } as Topic;
        });
        onSnapshot(qd, async (snapshot) => {
          const discussionsData = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const docData = doc.data();
              const userRef =
                docData?.createdBy as DocumentReference<DocumentData>;
              const topicRef =
                docData?.topic as DocumentReference<DocumentData>;

              let userData: DocumentData | null = null;
              let topicData: DocumentData | null = null;

              try {
                if (userRef) {
                  const userSnapshot = await getDoc(userRef);
                  if (userSnapshot.exists()) {
                    userData = {
                      id: userSnapshot?.id,
                      displayName: userSnapshot.data().displayName,
                    };
                  }
                }

                if (topicRef) {
                  const topicSnapshot = await getDoc(topicRef);
                  if (topicSnapshot.exists()) {
                    topicData = {
                      id: topicSnapshot?.id,
                      name: topicSnapshot.data().name,
                    };
                  }
                }
              } catch (error) {
                console.error("Error fetching referenced document:", error);
                return null;
              }

              return {
                id: doc.id,
                topic: topicData ?? null,
                createdAt: docData.createdAt.toDate(),
                createdBy: userData ?? null,
                title: doc.data().title,
                description: doc.data().description,
                upvotes: doc.data().upvotes,
                replyCount: doc.data().replyCount,
                views: doc.data().views,
              } as Discussion;
            })
          );

          setQuestions(discussionsData);
        });
        setTopics(data);
      });
    };
    getData();
    setLoading(false);
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
                    <div className="ml-auto mr-4">
                      {user && (
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            router.push("/discussions/ask");
                          }}
                          className={`flex gap-2`}
                        >
                          <PlusCircle className="h-4 w-4" />
                          Start Discussion
                        </Button>
                      )}
                    </div>
                  </div>
                  <TabsContent
                    value="recent"
                    className="border-none p-0 outline-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Active Discussions
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {`${questions.length} discussions available.`}
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <ScrollArea className="relative h-[70vh]">
                      {questions.length > 0 ? (
                        questions
                          .toSorted(
                            (a: Discussion | null, b: Discussion | null) => {
                              const dateA = a?.createdAt
                                ? new Date(a?.createdAt).getTime()
                                : new Date().getTime();
                              const dateB = b?.createdAt
                                ? new Date(b?.createdAt).getTime()
                                : new Date().getTime();
                              return dateB - dateA;
                            }
                          )
                          .map((item) => {
                            return (
                              <div key={item?.id}>
                                <DiscussionCard item={item} />
                                <Separator className="my-4" />
                              </div>
                            );
                          })
                      ) : (
                        <p>No discussions for now! Start a new discussion.</p>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent
                    value="popular"
                    className="h-full flex-col border-none p-0 data-[state=active]:flex"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Popular Discussions
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Discussions that were voted the most.
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <ScrollArea className="relative h-[70vh]">
                      {questions.length > 0 ? (
                        questions
                          .toSorted(
                            (a, b) =>
                              (b ? b.upvotes?.length : 0) -
                              (a ? a.upvotes?.length : 0)
                          )
                          .map((item) => {
                            return (
                              <div key={item?.id}>
                                <DiscussionCard item={item} />
                                <Separator className="my-4" />
                              </div>
                            );
                          })
                      ) : (
                        <p>No discussions for now! Start a new discussion.</p>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent
                    value="oldest"
                    className="h-full flex-col border-none p-0 data-[state=active]:flex"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Oldest Discussions
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Discussions sorted by post date.
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <ScrollArea className="relative h-[70vh]">
                      {questions.length > 0 ? (
                        questions
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
                                <DiscussionCard item={item} />
                                <Separator className="my-4" />
                              </div>
                            );
                          })
                      ) : (
                        <p>No discussions for now! Start a new discussion.</p>
                      )}
                    </ScrollArea>
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
