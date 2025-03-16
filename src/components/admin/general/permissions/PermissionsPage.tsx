"use client";

import React from "react";
import PageHeader from "../../main/PageHeader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import AddPermission from "./AddPermission";
import { ListPermissions } from "./ListPermissions";

function PermissionsPage() {
  const defaultLayout = [70, 30];
  return (
    <div className="w-full space-y-4 p-8 pt-6">
      <PageHeader
        title="System Permissions"
        newItem={false}
        onExport={() => null}
        onPublish={() => null}
        saveDraft={() => null}
      />
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <AddPermission />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <ListPermissions />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default PermissionsPage;
