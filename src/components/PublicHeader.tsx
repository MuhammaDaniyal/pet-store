import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-client";
import { ClientNav } from "./ClientNav";

export async function PublicHeader() {
  // Safe server-side fetch
  const user = await getCurrentUser();

  return (
    <header className="relative sticky top-0 z-50 w-full border-b border-border/50 bg-[#cfc9be]/40 dark:bg-background/80 shadow-sm backdrop-blur-md">
      {/* Localized Grain Overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5 sm:px-12">
        <Link href="/" className="text-[11px] font-bold tracking-[0.28em] text-primary">
          PETSTORE
        </Link>

        <ClientNav user={user} />

      </div>
    </header>
  );
}