import Link from "next/link";
import { Package, ArrowRight, Clock3, Truck } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(26,83,92,0.06)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              Orders
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-[-0.04em] text-primary">
              Order history and tracking
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">
              This space is ready for recent purchases, shipment milestones, and delivery support.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Browse shop
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Status",
            value: "Ready",
            icon: Package,
            body: "Your order timeline will appear here once the cart and checkout flows are wired up.",
          },
          {
            label: "Tracking",
            value: "Live updates",
            icon: Truck,
            body: "Shipment progress and delivery updates can be surfaced in this panel later.",
          },
          {
            label: "Recent activity",
            value: "No orders yet",
            icon: Clock3,
            body: "New purchases will populate the history list with reorder shortcuts and receipts.",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="rounded-[28px] border border-border bg-background/70 p-5 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                    {item.label}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-primary">{item.value}</h2>
                </div>
                <div className="rounded-2xl border border-accent/20 bg-accent/10 p-3 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-secondary">{item.body}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
