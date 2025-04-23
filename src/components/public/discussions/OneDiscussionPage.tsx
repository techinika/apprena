"use client";

import { Metadata } from "next";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useAuth } from "@/lib/AuthContext";
import AuthNav from "@/components/client/navigation/AuthNav";
import Nav from "@/components/client/navigation/Nav";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import { Discussion, Topic } from "@/types/Discussion";
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import { redirect, useRouter } from "next/navigation";
import Loading from "@/app/loading";
import FooterSection from "@/components/sections/footer/default";
import { formatDistance } from "date-fns";

export const metadata: Metadata = {
  title: "Community Discussions",
  description: "Example music app using the components.",
};

export type CustomUser = {
  id: string;
  displayName: string;
  email: string;
  uid: string;
};

export default function MainPage({ discussionId }: { discussionId: string }) {
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState<Discussion>();
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    let isMounted = true;

    const fetchData = async () => {
      try {
        const topicCollection = collection(db, "topics");
        const q = query(topicCollection);

        const discussionRef = doc(db, "discussions", discussionId);
        const discussionSnap = await getDoc(discussionRef);

        if (!discussionSnap.exists()) {
          redirect("/discussions");
        }

        const docData = discussionSnap.data();
        const userRef = docData?.createdBy as DocumentReference<DocumentData>;
        const topicRef = docData?.topic as DocumentReference<DocumentData>;

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

        setDiscussion({
          id: discussionSnap.id,
          topic: topicData
            ? {
                id: topicData.id,
                name: topicData.name,
                createdAt: formatDistance(
                  topicData.createdAt.toDate(),
                  new Date(),
                  { includeSeconds: true }
                ),
              }
            : null,
          createdAt: formatDistance(docData.createdAt.toDate(), new Date(), {
            includeSeconds: true,
          }),
          createdBy: userData
            ? {
                displayName: userData?.displayName,
                id: userData?.id,
                uid: userData?.uid,
                email: userData?.email,
              }
            : null,
          content: docData?.content,
          title: docData.title,
          status: docData?.status,
          description: docData.description,
          upvotes: docData.upvotes,
          replyCount: docData.replyCount,
          views: docData.views,
        });

        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (isMounted) {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name,
              description: doc.data().description,
              createdAt: formatDistance(
                doc.data().createdAt.toDate(),
                new Date(),
                {
                  includeSeconds: true,
                }
              ),
            }));
            setTopics(data);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
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
                <div className="space-between flex items-center">
                  <div></div>
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
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {discussion?.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      {discussion?.description}
                    </p>
                    <div className="text-xs flex items-center justify-between pt-3">
                      <div className="flex items-center gap-2">
                        {/* <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              discussion?.createdBy?.photoURL
                                ? discussion?.createdBy?.photoURL
                                : "/placeholder.jpg"
                            }
                            alt={
                              discussion?.createdBy?.displayName || "No Name"
                            }
                          />
                          <AvatarFallback>
                            {discussion?.createdBy?.displayName[0]}
                          </AvatarFallback>
                        </Avatar> */}
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {discussion?.createdBy?.displayName ?? "No Name"}
                          </p>
                        </div>
                      </div>
                      <div className="text-muted-foreground">
                        <p>
                          Posted {discussion?.createdAt} in{" "}
                          <b>{discussion?.topic?.name}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="my-3" />
                <div
                  className="prose prose-sm dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: discussion?.content ?? "",
                  }}
                  style={{ lineHeight: 2 }}
                ></div>
                <Separator className="my-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
