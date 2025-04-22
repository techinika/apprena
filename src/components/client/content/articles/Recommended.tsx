"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/AuthContext";
import { Article } from "@/types/Article";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function Recommended({ item }: { item: Article }) {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div
      className="rounded-xl border bg-card text-card-foreground shadow-sm flex gap-6 items-center max-h-[50%] cursor-pointer"
      onClick={() => router.push(`/articles/${item?.id}`)}
    >
      <div className="h-full">
        <Image
          src="/placeholder.jpg"
          width={200}
          height={200}
          alt={item?.title}
          className="object-cover aspect-square w-40 h-full rounded-l-md "
        />
      </div>
      <div className="flex flex-col justify-between items-start gap-2 p-4">
        <Badge className="text-xs font-semibold">
          {item?.category?.name.toUpperCase()}
        </Badge>
        <h2 className="font-bold text-lg">{item?.title}</h2>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.photoURL ? user?.photoURL : "/placeholder.jpg"}
              alt={user?.displayName || "No Name"}
            />
            <AvatarFallback>{user?.displayName}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user?.displayName}</p>
            {item?.publishedAt && (
              <p className="text-xs">
                Posted {new Date(item?.publishedAt).getDay()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recommended;
