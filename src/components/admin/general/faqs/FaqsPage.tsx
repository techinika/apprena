"use client";

import React from "react";
import { ListFaqs } from "./ListFaqs";
import PageHeader from "../../main/PageHeader";
import AddFaq from "./AddFaq";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

function FaqsPage({ defaultLayout = [70, 30] }: MailProps) {
  return (
    <div className="w-full space-y-4 p-8 pt-6">
      <PageHeader
        title="Frequently Asked Questions"
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
          <AddFaq />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <ListFaqs />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default FaqsPage;
