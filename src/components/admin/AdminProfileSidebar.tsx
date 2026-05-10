"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserCog, Edit, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
  { href: "/admin/profile", label: "Profile", icon: UserCog },
  { href: "/admin/profile/edit", label: "Edit profile", icon: Edit },
];

export function AdminProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      setIsLoggingOut(false);
      console.error("Logout failed", err);
    }
  }

  return (
    <nav className="flex flex-col gap-2">
      {sidebarLinks.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon as any;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
              isActive ? "bg-accent text-white shadow-md" : "text-secondary hover:bg-surface hover:text-primary"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-muted transition-colors group-hover:text-accent"}`} />
            {link.label}
          </Link>
        );
      })}

      <div className="mt-3">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium border border-border bg-surface text-primary hover:bg-accent/10 disabled:opacity-50"
        >
          {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </nav>
  );
}
