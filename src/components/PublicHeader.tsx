import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-client";

export async function PublicHeader() {
  const user = await getCurrentUser();

  return (
    <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-8 py-6 sm:px-12">
      <Link href="/" className="text-[11px] font-bold tracking-[0.28em] text-primary">
        PETSTORE
      </Link>
      <nav className="flex items-center gap-6 text-[12px] text-secondary">
        <Link href="/about" className="transition-colors hover:text-primary">
          About
        </Link>
        <Link href="/contact" className="font-medium text-primary">
          Contact
        </Link>
        <Link href="/shop" className="transition-colors hover:text-primary">
          Shop
        </Link>

        {user ? (
          <>
            <Link href="/cart" className="transition-colors hover:text-primary">
              Cart
            </Link>
            <Link href="/checkout" className="transition-colors hover:text-primary">
              Checkout
            </Link>
            <Link
              href="/account"
              className="rounded-full border border-[#C8C6C0] px-5 py-2 text-[13px] transition-colors hover:border-[#0A0A0A] hover:text-primary"
            >
              {user.name}
            </Link>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-full border border-[#C8C6C0] px-5 py-2 text-[13px] transition-colors hover:border-[#0A0A0A] hover:text-primary"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
