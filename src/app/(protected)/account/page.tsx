import Link from "next/link";
import { ArrowRight, Heart, Package, Sparkles, UserRound } from "lucide-react";

import { getCurrentUser } from "@/lib/auth-client";
import { findAccountProfileById } from "@/lib/users";

const dashboardHighlights = [
  {
    label: "Profile",
    value: "Ready to edit",
    description: "Keep your contact details and delivery info current.",
    href: "/account/profile",
    icon: UserRound,
  },
  {
    label: "Orders",
    value: "Track progress",
    description: "Review recent purchases and delivery updates.",
    href: "/account/orders",
    icon: Package,
  },
  {
    label: "Wishlist",
    value: "Saved for later",
    description: "Return to items you want to revisit soon.",
    href: "/account/wishlist",
    icon: Heart,
  },
];

export default async function AccountPage() {
  const authUser = await getCurrentUser();
  const profile = authUser ? await findAccountProfileById(authUser.userId) : null;
  const displayName = profile?.name ?? authUser?.name ?? "there";
  const memberSince = profile
    ? new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
        new Date(profile.createdAt)
      )
    : "recently";

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(26,83,92,0.06)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Account dashboard
            </div>

            <h1 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-primary">
              Welcome back, {displayName}.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary sm:text-lg">
              Keep track of your orders, saved items, and profile details from one calm,
              focused place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/account/profile"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(255,107,53,0.25)]"
              >
                Edit profile
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-accent/30 hover:bg-accent/10"
              >
                Continue shopping
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-[28px] border border-border bg-background/70 p-4 sm:min-w-70">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted">
                Signed in as
              </p>
              <p className="mt-2 text-lg font-semibold text-primary">{profile?.email ?? authUser?.email}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Role</p>
                <p className="mt-2 text-sm font-medium text-primary">
                  {profile?.role ?? authUser?.role}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Member since</p>
                <p className="mt-2 text-sm font-medium text-primary">{memberSince}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="group rounded-[28px] border border-border bg-surface p-5 shadow-[0_16px_40px_rgba(26,83,92,0.05)] transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                    {item.label}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-primary">{item.value}</h2>
                </div>
                <div className="rounded-2xl border border-accent/20 bg-accent/10 p-3 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-secondary">{item.description}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
            What to do next
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-primary">
            Keep the account experience tidy.
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Complete your profile",
                body: "Add your delivery number and address so checkout stays fast.",
              },
              {
                title: "Review saved items",
                body: `You currently have ${profile?.wishlistCount ?? 0} saved item${
                  (profile?.wishlistCount ?? 0) === 1 ? "" : "s"
                } in your wishlist.`,
              },
              {
                title: "Track orders",
                body: "Use the orders page to watch shipment status and history.",
              },
              {
                title: "Stay updated",
                body: "Check profile and account details before your next purchase.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-background/70 p-4">
                <h3 className="text-sm font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-border bg-background/70 p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
            Quick links
          </p>

          <div className="mt-5 space-y-3">
            {[
              { label: "Profile settings", href: "/account/profile" },
              { label: "Order history", href: "/account/orders" },
              { label: "Saved items", href: "/account/wishlist" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium text-primary transition-colors hover:border-accent/30 hover:bg-accent/10"
              >
                {link.label}
                <ArrowRight className="h-4 w-4 text-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
