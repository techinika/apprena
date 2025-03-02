"use client";

import React from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import Editor from "./Editor";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import PageHeader from "../main/PageHeader";

const AddNewPost = () => {
  const [date, setDate] = React.useState<Date>();

  const visibility = [
    {
      value: "Public",
      label: "public",
    },
    {
      value: "Private",
      label: "private",
    },
  ];

  const publishers = [
    {
      label: "Achille Songa",
      value: "achille",
    },
    {
      label: "Administrator",
      value: "admin",
    },
  ];

  return (
    <div className="space-y-4 p-8 pt-6">
      <PageHeader
        title="Add New Post"
        newItem={true}
        onPublish={() => console.log("clicked")}
        onExport={() => console.log("clicked")}
        saveDraft={() => console.log("draft")}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="w-[80%]">
          <input
            placeholder="Enter the post title here..."
            className="text-2xl font-bold py-5 mb-1 w-full"
          />
          <Editor />
        </div>
        <div className="w-[20%] p-5 rounded border border-gray-100">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col space-y-1.5 gap-1">
              <Label htmlFor="visibility" className="font-bold">
                Publishing Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col space-y-1.5 gap-1">
              <Label htmlFor="visibility" className="font-bold">
                Visibility
              </Label>
              <Select>
                <SelectTrigger id="visibility">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {visibility?.map((item) => (
                    <SelectItem key={item?.value} value={item?.value}>
                      {item?.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5 gap-1">
              <Label htmlFor="visibility" className="font-bold">
                Publishers
              </Label>
              <Select>
                <SelectTrigger id="visibility">
                  <SelectValue placeholder="Select publisher" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {publishers?.map((item) => (
                    <SelectItem key={item?.value} value={item?.value}>
                      {item?.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewPost;
