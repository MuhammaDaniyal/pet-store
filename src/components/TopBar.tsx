"use client";

import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  return (
    <div className="fixed top-0 right-0 z-50 p-6">
      <ThemeToggle />
    </div>
  );
}
