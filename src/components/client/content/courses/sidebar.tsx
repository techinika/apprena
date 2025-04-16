"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Topic } from "@/types/Discussion";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  topics: Topic[];
}

export function Sidebar({ className, topics }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Filter
          </h2>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M3 4v16c1 0 2-.5 3-1s2-.5 3 0 2 .5 3 0 2-.5 3 0 2 .5 3 0 2-.5 3-1V4" />
                <path d="M3 4c1 0 2 .5 3 1s2 .5 3 0 2-.5 3 0 2 .5 3 0 2-.5 3-1" />
              </svg>
              All Courses
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M9 12l2 2 4-4" />
                <path d="M4 4h16v16H4z" />
              </svg>
              Enrolled Courses
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5z" />
                <path d="M9 9l2 2 4-4" />
              </svg>
              Finished Courses
            </Button>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Topics
          </h2>
          <ScrollArea className="h-[500px] px-1">
            <div className="space-y-1 p-2">
              <Button
                variant="ghost"
                className="w-full justify-start font-normal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
                  <path d="M8 8h8M12 8v8" />
                </svg>
                All Topics
              </Button>
              {topics?.map((topic, i) => (
                <Button
                  key={`${topic}-${i}`}
                  variant="ghost"
                  className="w-full justify-start font-normal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
                    <path d="M8 8h8M12 8v8" />
                  </svg>

                  {topic?.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
