"use client";

import { Metadata } from "next";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { playlists } from "./data/playlists";
import { useAuth } from "@/lib/AuthContext";
import AuthNav from "@/components/client/navigation/AuthNav";
import Nav from "@/components/client/navigation/Nav";
import { Sidebar } from "./sidebar";
import { useState } from "react";
import DiscussionCard from "./DiscussionCard";
import { Discussion } from "@/types/Discussion";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "Community Discussions",
  description: "Example music app using the components.",
};

export default function MainPage() {
  const { user } = useAuth();
  const [questions] = useState<Discussion[]>([]);
  return (
    <div className="md:block">
      {user ? <AuthNav /> : <Nav />}
      <div className="size border-t">
        <div className="bg-background">
          <div className="grid lg:grid-cols-5">
            <Sidebar playlists={playlists} className="hidden lg:block" />
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
                      <Button className="flex gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Start Discussion
                      </Button>
                    </div>
                  </div>
                  <TabsContent
                    value="recent"
                    className="border-none p-0 outline-none"
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
                          .toSorted((a, b) => {
                            const dateA = new Date(a?.createdAt).getTime();
                            const dateB = new Date(b?.createdAt).getTime();
                            return dateB - dateA;
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
                          .sort(
                            (a, b) => b?.upvotes.length - a?.upvotes?.length
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
                            const dateA = new Date(a?.createdAt).getTime();
                            const dateB = new Date(b?.createdAt).getTime();
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
    </div>
  );
}
