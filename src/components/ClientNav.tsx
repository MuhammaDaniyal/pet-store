/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the type for the user prop so TypeScript stays happy
interface ClientNavProps {
  user: any; // You can replace 'any' with your actual User type if you have one!
}

export function ClientNav({ user }: ClientNavProps) {
  const pathname = usePathname();

  // Helper array for standard links
  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Shop", href: "/shop" },
    { name: "Vet Clinic", href: "/vets" },
  ];

  return (
    <nav className="flex items-center gap-6 text-[13px]">
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
    </nav>
  );
}