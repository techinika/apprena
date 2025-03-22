"use client"

import React from "react";
import { CalendarDateRangePicker } from "../home/range-picker";
import { Button } from "../../ui/button";

function PageHeader({
  title,
  newItem,
  onExport,
  onPublish,
  saveDraft,
}: {
  title: string;
  newItem: boolean;
  onExport: () => void;
  onPublish: () => void;
  saveDraft: () => void;
}) {
  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <div className="flex items-center space-x-2">
        {!newItem && <CalendarDateRangePicker />}
        {newItem && (
          <Button onClick={saveDraft} variant="secondary">
            Save Draft
          </Button>
        )}
        {newItem && <Button onClick={onPublish}>Submit</Button>}
        {!newItem && <Button onClick={onExport}>Export</Button>}
      </div>
    </div>
  );
}

export default PageHeader;
