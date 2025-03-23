"use client";

import React, { useState } from "react";
import AuthNav from "../../navigation/AuthNav";
import Nav from "../../navigation/Nav";
import { useAuth } from "@/lib/AuthContext";
import FooterSection from "@/components/sections/footer/default";
import { Article } from "@/types/Article";

function OneArticleView({ slug }: { slug: string }) {
  const { user } = useAuth();
  const [article, setArticle] = useState<Article>({
    title:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo magnam reprehenderit iure fugiat!",
    content: `<h1>Introduction</h1>`,
    slug: "lorem-ipsum",
    writtenBy: "1",
    availability: "public",
    status: "draft",
    createdAt: new Date(),
    id: "lorem-ipsum",
    institutionOwning: "Techinika",
    category: "Technology",
  });
  return (
    <div>
      {user ? <AuthNav /> : <Nav />}
      <div></div>
      <div className="size">
        <article
          dangerouslySetInnerHTML={{ __html: article?.content }}
        ></article>
      </div>
      <FooterSection />
    </div>
  );
}

export default OneArticleView;
