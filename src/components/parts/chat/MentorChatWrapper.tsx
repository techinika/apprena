"use client";

import dynamic from "next/dynamic";

const MentorChat = dynamic(() => import("@/components/parts/chat/MentorChat"), {
  ssr: false,
});

export default function MentorChatWrapper() {
  return <MentorChat />;
}
