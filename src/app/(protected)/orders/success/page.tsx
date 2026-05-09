"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-border bg-surface p-8 text-center shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl">
          ✓
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-primary">Order placed successfully</h1>
        <p className="mt-3 text-sm leading-relaxed text-secondary">
          Your order has been received and is ready for processing.
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-background/70 p-4 text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">Order ID</p>
          <p className="mt-2 break-all text-sm font-medium text-primary">{orderId || "Unavailable"}</p>
        </div>

        <Link
          href="/shop"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Back to Shop
        </Link>
      </div>
    </main>
  );
}
