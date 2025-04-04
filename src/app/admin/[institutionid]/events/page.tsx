import EventList from "@/components/admin/events/EventList";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <EventList institutionId={institutionid} />
    </div>
  );
}

export default page;
