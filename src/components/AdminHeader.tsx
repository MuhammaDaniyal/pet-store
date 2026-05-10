"use client";

import Link from "next/link";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/sign-in");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-[#cfc9be]/40 dark:bg-background/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex w-full items-center justify-between px-8 py-4">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="text-[11px] font-bold tracking-[0.28em] text-primary">
            ADMIN PANEL
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/admin" className="text-primary/60 hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/admin/vets" className="text-primary/60 hover:text-primary transition-colors">Vets</Link>
            <Link href="/admin/appointments" className="text-primary/60 hover:text-primary transition-colors">Appointments</Link>
            <Link href="/admin/profile" className="text-primary/60 hover:text-primary transition-colors">Profile</Link>
          </nav>
        </div>
        <div>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </header>
  );
}
