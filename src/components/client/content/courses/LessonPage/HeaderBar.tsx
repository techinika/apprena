"use client";

export default function CourseHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Complete Website Responsive Design: from Figma to Webflow to Website
          Design
        </h1>
        <div className="flex items-center text-sm text-gray-600 gap-4 mt-1">
          <span>6 Sections</span>
          <span>202 Lectures</span>
          <span>19h 37m</span>
        </div>
      </div>
      <div className="flex gap-2 mt-4 md:mt-0">
        <button className="border border-gray-300 rounded px-4 py-1 text-sm hover:bg-gray-50">
          Write A Review
        </button>
        <button className="bg-blue-800 text-white rounded px-4 py-1 text-sm hover:bg-blue-700">
          Next Lecture
        </button>
      </div>
    </div>
  );
}
