/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

// Define the type for the user prop so TypeScript stays happy
interface ClientNavProps {
  user: any; // You can replace 'any' with your actual User type if you have one!
}

export function ClientNav({ user }: ClientNavProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper array for standard links
  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Shop", href: "/shop" },
    ...(user ? [{ name: "Vet Clinic", href: "/vets" }] : []),
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* ── Desktop Nav ── */}
      <nav className="hidden md:flex items-center gap-6 text-[13px]">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-primary/60 hover:text-primary"
              }`}
            >
              {link.name}
            </Link>
          );
        })}

        {user ? (
          <>
            <Link
              href="/cart"
              className={`font-medium transition-colors ${
                pathname === "/cart"
                  ? "text-primary"
                  : "text-primary/60 hover:text-primary"
              }`}
            >
              Cart
            </Link>
            <Link
              href="/checkout"
              className={`font-medium transition-colors ${
                pathname === "/checkout"
                  ? "text-primary"
                  : "text-primary/60 hover:text-primary"
              }`}
            >
              Checkout
            </Link>
            <Link
              href="/account"
              className={`rounded-full px-5 py-2 font-medium transition-all duration-300 ${
                pathname === "/account"
                  ? "bg-primary text-background border border-primary shadow-md"
                  : "border border-primary/20 text-primary/80 hover:border-primary hover:text-primary"
              }`}
            >
              {user.name}
            </Link>
          </>
        ) : (
          <Link
            href="/sign-in"
            className={`rounded-full px-5 py-2 font-medium transition-all duration-300 ${
              pathname === "/sign-in"
                ? "bg-primary text-background border border-primary shadow-md"
                : "border border-primary/20 text-primary/80 hover:border-primary hover:text-primary"
            }`}
          >
            Sign in
          </Link>
        )}

        {/* Theme toggle — desktop */}
        <ThemeToggle />
      </nav>

      {/* ── Mobile: action buttons + hamburger ── */}
      <div className="flex md:hidden items-center gap-2">
        {/* Theme toggle — always visible */}
        <ThemeToggle />

        {/* Account pill — always visible on mobile */}
        {user ? (
          <Link
            href="/account"
            onClick={closeMobileMenu}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-300 ${
              pathname === "/account"
                ? "bg-primary text-background border border-primary shadow-md"
                : "border border-primary/20 text-primary/80 hover:border-primary hover:text-primary"
            }`}
          >
            {user.name}
          </Link>
        ) : (
          <Link
            href="/sign-in"
            onClick={closeMobileMenu}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-300 ${
              pathname === "/sign-in"
                ? "bg-primary text-background border border-primary shadow-md"
                : "border border-primary/20 text-primary/80 hover:border-primary hover:text-primary"
            }`}
          >
            Sign in
          </Link>
        )}

        {/* Hamburger / Close toggle */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
          className="p-2 rounded-lg text-primary/70 hover:text-primary hover:bg-primary/10 transition-all duration-200"
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
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute top-full left-0 w-full md:hidden z-40
                       bg-[#cfc9be]/95 dark:bg-background/95
                       backdrop-blur-md border-b border-border/50
                       shadow-xl shadow-black/10"
          >
            <div className="mx-auto max-w-6xl px-8 sm:px-12 py-6 flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`text-[15px] font-medium transition-colors py-1 ${
                      isActive
                        ? "text-primary"
                        : "text-primary/60 hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="border-t border-border/40 pt-4 flex flex-col space-y-4">
                {user ? (
                  <>
                    <Link
                      href="/cart"
                      onClick={closeMobileMenu}
                      className={`text-[15px] font-medium transition-colors py-1 ${
                        pathname === "/cart"
                          ? "text-primary"
                          : "text-primary/60 hover:text-primary"
                      }`}
                    >
                      Cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeMobileMenu}
                      className={`text-[15px] font-medium transition-colors py-1 ${
                        pathname === "/checkout"
                          ? "text-primary"
                          : "text-primary/60 hover:text-primary"
                      }`}
                    >
                      Checkout
                    </Link>
                    <Link
                      href="/account"
                      onClick={closeMobileMenu}
                      className="inline-flex items-center self-start rounded-full px-5 py-2 text-[13px] font-medium border border-primary/20 text-primary/80 hover:border-primary hover:text-primary transition-all duration-300"
                    >
                      {user.name}
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={closeMobileMenu}
                    className="inline-flex items-center self-start rounded-full px-5 py-2 text-[13px] font-medium border border-primary/20 text-primary/80 hover:border-primary hover:text-primary transition-all duration-300"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}