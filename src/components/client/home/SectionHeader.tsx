"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";

function SectionHeader({
  title,
  buttonText,
  link,
}: {
  title: string;
  buttonText: string | null;
  link: string | null;
}) {
  return (
    <div className="mt-2 mb-5">
      <div className="py-4 flex justify-between items-center">
        <h2 className="font-bold text-xl">{title}</h2>
        {buttonText && link && (
          <Link href={link}>
            <Button variant="default" className="font-bold">
              {buttonText}
            </Button>
          </Link>
        )}
      </div>
      <Separator />
    </div>
  );
}

export default SectionHeader;
