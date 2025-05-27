"use client";

import React from "react";

function MainSettings({ institutionId }: { institutionId: string }) {
  return (
    <div>
      <p>Settings for {institutionId}</p>
    </div>
  );
}

export default MainSettings;
