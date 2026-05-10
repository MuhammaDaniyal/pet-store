"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  UserCog,
  LogOut,
  Loader2,
  Stethoscope,
} from "lucide-react";

const navLinks = [
  { href: "/vet/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vet/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/vet/profile", label: "Profile & Schedule", icon: UserCog },
];

function VetSidebar() {
  const pathname = usePathname();
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
    <aside className="md:col-span-1 md:sticky md:top-6 h-fit">
      <div className="rounded-[28px] border border-border bg-surface p-4 shadow-[0_18px_50px_rgba(26,83,92,0.06)]">
        {/* Brand */}
        <div className="border-b border-border/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted">
                Vet Portal
              </p>
              <h2 className="text-base font-semibold text-primary">Dashboard</h2>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                  isActive
                    ? "border-accent/40 bg-accent text-white shadow-[0_12px_30px_rgba(255,107,53,0.22)]"
                    : "border-border bg-background/60 text-primary hover:border-accent/30 hover:bg-accent/10"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-accent"}`} />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}

          <div className="my-4 h-px w-full bg-black/5 dark:bg-white/10" />

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </button>
        </nav>
      </div>
    </aside>
  );
}

export default function VetLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:items-start">
        <VetSidebar />
        <section className="min-w-0 space-y-6">{children}</section>
      </div>
    </main>
  );
}
