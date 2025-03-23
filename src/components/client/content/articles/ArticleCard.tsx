"use client";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { Article } from "@/types/Article";
import { Clock, User, Vote } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function ArticleCard({ item }: { item: Article }) {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div
      className="cursor-pointer"
      onClick={() => router.push(`/articles/${item?.id}`)}
    >
      <Card className="max-w-md mx-auto h-full cursor-pointer shadow-lg rounded-lg">
        <Image
          className="w-full h-64 object-cover object-center rounded-t-md"
          width={100}
          height={100}
          src={"/course.jpg"}
          alt={item?.title}
        />
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-2">{item?.title}</h2>
          <p className="text-gray-600 mb-2">
            {item?.summary && item?.summary.slice(0, 200)}
          </p>
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center">
              <Clock className="text-gray-400 mr-1" />
              <p className="text-sm text-gray-400">
                {item?.readingTime || 0} minutes
              </p>
            </div>
            <div className="flex items-center">
              <Vote className="text-gray-400 mr-1" />
              <p className="text-sm text-gray-400">{item?.likes || 0} Votes</p>
            </div>
            <div className="flex items-center">
              <User className="text-gray-400 mr-1" />
              <p className="text-sm text-gray-400">
                Written by {user?.displayName}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ArticleCard;
