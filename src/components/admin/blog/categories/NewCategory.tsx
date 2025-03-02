import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

function NewCategory() {
  return (
    <form className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div></div>
        <Button>Create Category</Button>
      </div>
      <div className="flex flex-col space-y-1.5 gap-1">
        <Label htmlFor="name" className="font-bold">
          Category Name
        </Label>
        <Input type="text" placeholder="Enter Category Name" />
      </div>
      <div className="flex flex-col space-y-1.5 gap-1">
        <Label htmlFor="name" className="font-bold">
          Category Description
        </Label>
        <Textarea rows={7} />
      </div>
    </form>
  );
}

export default NewCategory;
