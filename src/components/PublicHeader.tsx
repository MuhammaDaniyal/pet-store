import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-client";

export async function PublicHeader() {
  const user = await getCurrentUser();

  return (
    <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-8 py-6 sm:px-12">
      <Link href="/" className="text-[11px] font-bold tracking-[0.28em] text-[#0A0A0A]">
        PETSTORE
      </Link>
      <nav className="flex items-center gap-6 text-[12px] text-[#4A4945]">
        <Link href="/about" className="transition-colors hover:text-[#0A0A0A]">
          About
        </Link>
        <Link href="/contact" className="font-medium text-[#0A0A0A]">
          Contact
        </Link>
        <Link href="/shop" className="transition-colors hover:text-[#0A0A0A]">
          Shop
        </Link>

        {user ? (
          <>
            <Link href="/cart" className="transition-colors hover:text-[#0A0A0A]">
              Cart
            </Link>
            <Link href="/checkout" className="transition-colors hover:text-[#0A0A0A]">
              Checkout
            </Link>
            <Link
              href="/account"
              className="rounded-full border border-[#C8C6C0] px-5 py-2 text-[13px] transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
            >
              {user.name}
            </Link>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-full border border-[#C8C6C0] px-5 py-2 text-[13px] transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
