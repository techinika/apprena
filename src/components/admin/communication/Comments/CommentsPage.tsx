"use client";

import Image from "next/image";
import { MailH } from "./mail";
import { accounts, mails } from "./data";
import PageHeader from "@/components/admin/main/PageHeader";

export default function CommentsPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex flex-1 space-y-4 p-8 pt-6">
        <PageHeader
          title="Comments"
          newItem={false}
          onExport={() => null}
          onPublish={() => null}
          saveDraft={() => null}
        />
        <MailH
          accounts={accounts}
          mails={mails}
          defaultLayout={[70, 30]}
          defaultCollapsed={true}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
}
