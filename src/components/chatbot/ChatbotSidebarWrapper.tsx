"use client";

import { usePathname } from "next/navigation";
import SiderChatbot from "./SiderChatbot";

const HIDDEN_ON = ["/login", "/register", "/signup", "/sign-in", "/sign-up"];

export default function ChatbotSidebarWrapper() {
  const pathname = usePathname();

  if (HIDDEN_ON.includes(pathname)) {
    return null;
  }

  return <SiderChatbot />;
}
