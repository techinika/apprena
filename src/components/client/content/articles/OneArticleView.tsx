"use client";

import React, { useEffect, useState } from "react";
import AuthNav from "../../navigation/AuthNav";
import Nav from "../../navigation/Nav";
import { useAuth } from "@/lib/AuthContext";
import FooterSection from "@/components/sections/footer/default";
import { Article } from "@/types/Article";

function OneArticleView({ slug }: { slug: string | TrustedHTML }) {
  const { user } = useAuth();
  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    if (slug) {
      setArticle({
        title:
          "The Future of Technology: Innovations That Will Change the World",
        content: `
          <h1>The Future of Technology</h1>
          <p>Technology is evolving at a rapid pace, bringing innovations that shape our daily lives. From AI advancements to sustainable energy solutions, the future looks promising.</p>
          
          <h2>Artificial Intelligence</h2>
          <p>AI is transforming industries by automating tasks, enhancing decision-making, and personalizing user experiences. Self-driving cars, AI-driven healthcare, and smart assistants are just a few examples.</p>
          
          <img src="/course.jpg" alt="AI Revolution" class="rounded-xl shadow-md mx-auto my-4" />
          
          <h2>Renewable Energy</h2>
          <p>With the climate crisis becoming more urgent, the shift to renewable energy sources like solar and wind is accelerating. Innovations in battery storage and energy efficiency are making clean energy more viable.</p>
          
          <blockquote class="italic border-l-4 border-blue-500 pl-4 my-4">
            "The best way to predict the future is to create it." — Peter Drucker
          </blockquote>
          
          <h2>Space Exploration</h2>
          <p>Private companies like SpaceX and Blue Origin are making space travel more accessible. Colonization of Mars and deep-space exploration may soon become a reality.</p>
          
          <p class="font-bold mt-6">Stay tuned for more insights into the world of tech!</p>
        `,
        slug: "future-of-technology",
        writtenBy: "1",
        availability: "public",
        coverImage: "/course.jpg",
        status: "published",
        createdAt: new Date(),
        id: "future-of-technology",
        institutionOwning: "Techinika",
        category: "Technology",
      });
    }
  }, [slug]);

  return (
    <div className="min-h-screen">
      {user ? <AuthNav /> : <Nav />}

      <div className="mx-auto shadow-md rounded-lg p-6">
        {article && (
          <>
            <div className="relative w-full h-[30%]">
              <img
                src={article?.coverImage}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />

              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>

              <div className="size absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
                <h1 className="text-4xl font-bold">{article.title}</h1>
                <p className="text-sm mt-2">
                  Published on {article.createdAt.toDateString()} | Category:{" "}
                  {article.category}
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
