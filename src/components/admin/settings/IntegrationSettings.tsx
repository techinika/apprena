"use client";

import React from "react";

function IntegrationSettings({ institutionId }: { institutionId: string }) {
  return (
    <div>
      <p>Integration Settings for {institutionId}</p>
    </div>
  );
}

export default IntegrationSettings;
