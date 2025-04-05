"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Discussion } from "@/types/Discussion";
import Link from "next/link";
import React from "react";

function DiscussionCard({ item }: { item: Discussion }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-[15%] text-xs text-end font-light flex flex-col gap-3">
        <p className="text-sm font-semibold">
          {`${item?.upvotes.length}`} <i>upvotes</i>
        </p>
        <p>
          {`${item?.answers.length}`} <i>answers</i>
        </p>
        <p className="text-gray-400">
          {`${item?.views.length}`} <i>views</i>
        </p>
      </div>
      <Separator orientation="vertical" className="mx-2" />
      <div className="w-[85%]">
        <Link href="#" className="font-bold text-xl">
          {item?.title}
        </Link>
        <p className="text-sm">{item?.description}</p>
        <div className="flex items-center justify-between my-3">
          <div className="flex gap-2 items-center">
            {item?.topics.length > 0 &&
              item?.topics.map((item) => (
                <Button size="xs" className="text-xs" key={item}>
                  {item}
                </Button>
              ))}
          </div>
          <div className="text-xs">
            Created by <Link href="#">{item?.createdBy}</Link> on{" "}
            {item?.createdAt}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussionCard;
