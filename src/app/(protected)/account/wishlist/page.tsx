import Link from "next/link";
import { Heart, ArrowRight, Sparkles } from "lucide-react";

export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(26,83,92,0.06)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              Wishlist
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-[-0.04em] text-primary">
              Saved items, ready when you are
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
              Keep the products you love in one place so you can come back and buy them faster.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-accent/30 hover:bg-accent/10"
          >
            Continue shopping
            <ArrowRight className="h-4 w-4 text-accent" />
          </Link>
        </div>
      </section>

      <section className="rounded-[28px] border border-border bg-background/70 p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-3 text-accent">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              Wishlist preview
            </p>
            <h2 className="mt-2 text-xl font-semibold text-primary">No items rendered yet</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            "Saved products will sit here with quick-add buttons and price updates.",
            "Use this list to compare essentials before checkout without losing your picks.",
          ].map((message) => (
            <div key={message} className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-sm leading-relaxed text-secondary">{message}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                Next step
              </p>
              <h3 className="mt-2 text-lg font-semibold text-primary">Add a few favorites to test the flow</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                This page is styled and ready for the product data layer.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              Browse products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
