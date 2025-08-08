// components/LessonViewer.tsx
"use client";

import { Module } from "@/types/Course";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function LessonViewer({ modules }: { modules: Module[] }) {
  const { moduleId, lessonId } = useParams();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scrollReachedBottom, setScrollReachedBottom] = useState(false);

  const currentModule = modules.find((mod) => mod.id === moduleId);
  const currentLesson = currentModule?.lessons.find(
    (les) => les.id === lessonId
  );

  useEffect(() => {
    if (currentLesson?.type === "document") {
      const handleScroll = () => {
        const bottom =
          Math.ceil(window.innerHeight + window.scrollY) >=
          document.body.scrollHeight;
        if (bottom) setScrollReachedBottom(true);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [currentLesson?.type]);

  useEffect(() => {
    if (currentLesson?.type === "document" && scrollReachedBottom) {
      const timer = setTimeout(
        () => console.log("Document read complete"),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [scrollReachedBottom, currentLesson?.type]);

  if (!currentLesson) {
    return <p className="text-gray-500">Lesson not found.</p>;
  }

  const { type, title, url, duration } = currentLesson;

  return (
    <div className="w-full p-4 space-y-4">
      {type === "video" || type === "audio" ? (
        <div className="w-full aspect-video">
          <ReactPlayer
            url={url}
            controls
            playing
            width="100%"
            height="100%"
            onEnded={() => console.log("Video/Audio complete")}
            onProgress={({ played }) => console.log("Progress:", played)}
          />
        </div>
      ) : null}

      {type === "document" && (
        <div className="flex flex-col items-center mt-4">
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            className="border rounded shadow"
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                className="mb-4"
              />
            ))}
          </Document>
          {!scrollReachedBottom && (
            <p className="text-sm text-gray-500 mt-4">
              Scroll to the bottom to complete the lesson
            </p>
          )}
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium mt-4">{title}</h2>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 mt-1 flex items-center gap-3">
            <span>{duration}</span>
            <span>•</span>
            <span>{type.toUpperCase()}</span>
            <span>•</span>
            <span>512 students watching</span>
          </div>
          <div className="text-xs text-gray-400 mt-8">
            Last updated: Oct 26, 2020 • Comments: 154
          </div>
        </div>
      </div>
    </div>
  );
}
