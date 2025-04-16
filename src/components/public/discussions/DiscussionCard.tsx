"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Discussion } from "@/types/Discussion";
import { formatDistance } from "date-fns";
import Link from "next/link";
import React from "react";

function DiscussionCard({ item }: { item: Discussion | null }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-[15%] text-xs text-end font-light flex flex-col gap-3">
        <p className="text-sm font-semibold">
          {`${item?.upvotes.length}`} <i>upvotes</i>
        </p>
        <p>
          {`${item?.replyCount}`} <i>answers</i>
        </p>
        <p className="text-gray-400">
          {`${item?.views.length}`} <i>views</i>
        </p>
      </div>
      <Separator orientation="vertical" className="mx-2" />
      <div className="w-[85%]">
        <Link href={`/discussions/${item?.id}`} className="font-bold text-xl">
          {item?.title}
        </Link>
        <p className="text-sm">{item?.description}</p>
        <div className="flex items-center justify-between my-3">
          <div className="flex gap-2 items-center">
            {item?.topic && (
              <Button size="xs" className="text-xs">
                {item?.topic?.name}
              </Button>
            )}
          </div>
          <div className="text-xs">
            Created by{" "}
            <Link href={`/u/${item?.createdBy?.id}`}>
              {item?.createdBy?.displayName}
            </Link>{" "}
            in{" "}
            {item?.createdAt
              ? formatDistance(item?.createdAt, new Date(), {
                  includeSeconds: true,
                })
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussionCard;
