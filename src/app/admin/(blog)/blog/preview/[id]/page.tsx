import React from "react";

export default function BlogPreview({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Preview Blog Post {id}</h1>
      <p>This is a preview of the blog post with ID: {id}.</p>
    </div>
  );
}
