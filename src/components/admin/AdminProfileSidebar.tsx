"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCog } from "lucide-react";

const sidebarLinks = [
  { href: "/admin/profile", label: "Profile", icon: UserCog },
];

export function AdminProfileSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {sidebarLinks.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
              isActive
                ? "bg-accent text-white shadow-md"
                : "text-secondary hover:bg-surface hover:text-primary"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-muted transition-colors group-hover:text-accent"}`} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
