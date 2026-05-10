import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-client";

export default async function AdminProfilePage() {
  const authUser = await getCurrentUser();

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(26,83,92,0.06)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-primary">
              Admin Profile
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary sm:text-lg">
              Manage your administrator details.
            </p>
          </div>
          <div className="grid gap-3 rounded-[28px] border border-border bg-background/70 p-4 sm:min-w-70">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted">Signed in as</p>
              <p className="mt-2 text-lg font-semibold text-primary">{authUser?.email}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Role</p>
                <p className="mt-2 text-sm font-medium text-primary capitalize">{authUser?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-primary">Account details</h2>
          <div className="mt-6 rounded-2xl border border-border bg-background/70 p-4">
            <h3 className="text-sm font-semibold text-primary">Name</h3>
            <p className="mt-2 text-sm text-secondary">{authUser?.name}</p>
          </div>
        </div>
        <div className="rounded-[28px] border border-border bg-background/70 p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">Quick links</p>
          <div className="mt-5 space-y-3">
            <Link href="/admin" className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium text-primary transition-colors hover:border-accent/30 hover:bg-accent/10">
              Admin Dashboard
              <ArrowRight className="h-4 w-4 text-accent" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
