"use client";

import React from "react";

function BillingSettings({ institutionId }: { institutionId: string }) {
  return (
    <div>
      <p>Billing Settings for {institutionId}</p>
    </div>
  );
}

export default BillingSettings;
