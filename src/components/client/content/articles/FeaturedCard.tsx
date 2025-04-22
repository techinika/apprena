"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { Article } from "@/types/Article";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function FeaturedCard({ item }: { item: Article }) {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <Card className="my-5">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-2xl">
            <p>{item?.title}</p>
          </CardTitle>
          <CardDescription className="flex gap-6 items-center">
            <Badge className="text-xs">Featured</Badge>
            <Link
              href={`/articles/category/${item?.category}`}
            >{`${item?.category}`}</Link>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="w-[40%] p-5">{item?.summary?.slice(0, 200)}</div>
        <Image
          src={"/placeholder.jpg"}
          alt={item?.title}
          className="object-cover h-48 w-[60%] p-5 rounded-lg"
          width={500}
          height={100}
        />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
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
                Posted {new Date(item?.publishedAt)?.getDay()}
              </p>
            )}
          </div>
        </div>
        <Button onClick={() => router.push(`/articles/${item?.id}`)}>
          Continue Reading
        </Button>
      </CardFooter>
    </Card>
  );
}

export default FeaturedCard;
