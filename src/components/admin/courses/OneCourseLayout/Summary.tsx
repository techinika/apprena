"use client";

import React from "react";

function Summary({
  courseId,
  institutionId,
}: {
  courseId: string;
  institutionId: string;
}) {
  return (
    <div>
      <p>
        Course Summary of id {courseId} on org {institutionId}
      </p>
    </div>
  );
}

export default Summary;
