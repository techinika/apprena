import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";

function SectionHeader({
  title,
  buttonText,
}: {
  title: string;
  buttonText: string | null;
}) {
  return (
    <div className="mt-2 mb-5">
      <div className="py-4 flex justify-between items-center">
        <h2 className="font-bold text-xl">{title}</h2>
        {buttonText && (
          <Button variant="default" className="font-bold">
            {buttonText}
          </Button>
        )}
      </div>
      <Separator />
    </div>
  );
}

export default SectionHeader;
