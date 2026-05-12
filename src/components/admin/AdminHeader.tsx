"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const adminLinks = [
  { name: "Dashboard", href: "/admin" },
  { name: "Products", href: "/admin/products" },
  { name: "Vets", href: "/admin/vets" },
  { name: "Appointments", href: "/admin/appointments" },
  { name: "Profile", href: "/admin/profile" },
];

export function AdminHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="relative sticky top-0 z-50 w-full border-b border-border/50 bg-[#cfc9be]/40 dark:bg-background/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Admin Panel logo — left */}
        <Link href="/admin" className="text-[11px] font-bold tracking-[0.28em] text-primary">
          ADMIN PANEL
        </Link>

        {/* ── Desktop nav links ── */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {adminLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors ${
                pathname === link.href
                  ? "text-primary"
                  : "text-primary/60 hover:text-primary"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {/* Theme toggle — desktop */}
          <ThemeToggle />
        </nav>

        {/* ── Mobile: hamburger button ── */}
        {/* Theme toggle — always visible on mobile */}
        <ThemeToggle />

        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle admin mobile menu"
          className="md:hidden p-2 rounded-lg text-primary/70 hover:text-primary hover:bg-primary/10 transition-all duration-200"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMobileMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X size={20} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Menu size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Animated Mobile Drawer ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="admin-mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute top-full left-0 w-full md:hidden z-40
                       bg-[#cfc9be]/95 dark:bg-background/95
                       backdrop-blur-md border-b border-border/50
                       shadow-xl shadow-black/10"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col space-y-4">
              {adminLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`text-[15px] font-medium transition-colors py-1 ${
                    pathname === link.href
                      ? "text-primary"
                      : "text-primary/60 hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}