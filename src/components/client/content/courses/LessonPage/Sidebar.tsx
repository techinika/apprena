// components/CourseSidebar.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, FileAudio2, FileText, Lock, PlayCircle } from "lucide-react";
import { Module } from "@/types/Course";

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video":
      return <PlayCircle className="w-4 h-4 mr-1" />;
    case "audio":
      return <FileAudio2 className="w-4 h-4 mr-1" />;
    case "document":
      return <FileText className="w-4 h-4 mr-1" />;
    default:
      return <BookOpen className="w-4 h-4 mr-1" />;
  }
};

export default function CourseSidebar({ modules }: { modules: Module[] }) {
  const router = useRouter();
  const params = useParams();

  return (
    <aside className="w-full sm:w-80 border-r border-gray-200 h-full overflow-y-auto bg-white p-4">
      {modules.map((module) => (
        <div key={module.id} className="mb-6">
          <h3 className="text-md font-semibold mb-2">{module.moduleTitle}</h3>
          <ul className="space-y-1">
            {module.lessons.map((lesson) => {
              const isActive = params.lessonId === lesson.id;
              const isLocked = !lesson.unlocked;

              return (
                <li
                  key={lesson.id}
                  onClick={() => {
                    if (!isLocked) {
                      router.push(
                        `/courses/${params.courseId}/${module.id}/${lesson.id}`
                      );
                    }
                  }}
                  className={cn(
                    "flex items-center px-2 py-1 rounded cursor-pointer text-sm",
                    isActive && "bg-blue-100 text-blue-700 font-semibold",
                    isLocked
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-blue-50 transition"
                  )}
                >
                  {getLessonIcon(lesson.type)}
                  <span className="flex-1">{lesson.title}</span>
                  {isLocked && <Lock className="w-3 h-3 ml-1" />}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
