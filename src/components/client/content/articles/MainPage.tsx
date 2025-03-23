"use client";

import { useAuth } from "@/lib/AuthContext";
import React, { useEffect, useState } from "react";
import AuthNav from "../../navigation/AuthNav";
import Nav from "../../navigation/Nav";
import FooterSection from "@/components/sections/footer/default";
import { Article } from "@/types/Article";
import FeaturedCard from "./FeaturedCard";
import Recommended from "./Recommended";
import ArticleCard from "./ArticleCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CTA from "@/components/sections/cta/default";

const data: Article[] = [
  {
    title: "Arrange Your Code to Communicate Data Flow",
    summary:
      "Often you can further improve readability by extracting a method, e.g., by extracting the first 3 lines of the function on the above right into a getCheese method. However, in some scenarios, extracting a method isn’t possible or helpful, e.g., if data is used a second time for logging. If you order the lines to match the data flow, you can still increase code clarity:",
    content: "This is the content",
    isFeatured: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    photoURL: "/article-thumbnail.jpg",
    id: "1",
    slug: "this-is-the-title",
    institutionOwning: "1",
    availability: "public",
    tags: "tag1, tag2",
    category: "Technology",
    status: "published",
    views: 0,
    likes: 0,
    commentsCount: 0,
    readingTime: "5",
    writtenBy: "John Doe",
  },
  {
    title: "Arrange Your Code to Communicate Data Flow",
    summary:
      "Often you can further improve readability by extracting a method, e.g., by extracting the first 3 lines of the function on the above right into a getCheese method. However, in some scenarios, extracting a method isn’t possible or helpful, e.g., if data is used a second time for logging. If you order the lines to match the data flow, you can still increase code clarity:",
    content: "This is the content",
    isFeatured: false,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    photoURL: "/article-thumbnail.jpg",
    id: "19",
    slug: "this-is-the-title",
    institutionOwning: "1",
    availability: "public",
    tags: "tag1, tag2",
    category: "Technology",
    status: "published",
    views: 0,
    likes: 0,
    commentsCount: 0,
    readingTime: "5",
    writtenBy: "John Doe",
  },
];

function MainPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [mostRecommendedArticles, setMostRecommendedArticles] = useState<
    Article[]
  >([]);

  useEffect(() => {
    if (data) {
      setArticles(data);
      setFeaturedArticles(data);
      setMostRecommendedArticles(data);
    }
  }, []);

  return (
    <div>
      {user ? <AuthNav /> : <Nav />}
      <div className="size">
        <div className="p-6">
          <h2 className="font-bold text-4xl w-full p-6 text-center">
            Articles & Case Studies
          </h2>
          <p className="text-center text-lg">
            Articles, knowledge blogs and case studies from different
            organizations. Read to improve your skills score.
          </p>
        </div>
        <div>
          {featuredArticles
            ? featuredArticles.map((article) => {
                if (article?.isFeatured)
                  return <FeaturedCard key={article?.id} item={article} />;
              })
            : null}
          <div>
            <h2 className="font-bold text-2xl py-3 mt-3">
              Recommended Articles
            </h2>
            <div className="grid grid-cols-2 items-center gap-8 py-3">
              {mostRecommendedArticles
                ? mostRecommendedArticles.map((article) => {
                    return (
                      <div key={article?.id}>
                        <Recommended item={article} />
                      </div>
                    );
                  })
                : null}
            </div>
          </div>

          <div className="my-5">
            <h2 className="font-bold text-2xl py-3 mt-5">
              Discover More Topics
            </h2>
            <Tabs defaultValue="all" className="space-y-4 w-full">
              <TabsList>
                <TabsTrigger value="all">All Articles</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-8 py-3">
                  {articles
                    ? articles.map((article) => {
                        return (
                          <div key={article?.id}>
                            <ArticleCard item={article} />
                          </div>
                        );
                      })
                    : null}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <CTA />
      </div>
      <FooterSection />
    </div>
  );
}

export default MainPage;
