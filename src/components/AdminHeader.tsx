"use client";

import Link from "next/link";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-[#cfc9be]/40 dark:bg-background/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Admin Panel on the left */}
        <Link href="/admin" className="text-[11px] font-bold tracking-[0.28em] text-primary">
          ADMIN PANEL
        </Link>
        
        {/* Navigation links on the right */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/admin" className="text-primary/60 hover:text-primary transition-colors">Dashboard</Link>
          <Link href="/admin/vets" className="text-primary/60 hover:text-primary transition-colors">Vets</Link>
          <Link href="/admin/appointments" className="text-primary/60 hover:text-primary transition-colors">Appointments</Link>
          <Link href="/admin/profile" className="text-primary/60 hover:text-primary transition-colors">Profile</Link>
        </nav>
      </div>
    </header>
  );
}