import Link from "next/link";
import { CalendarDays, Mail, MapPin, Phone, ShieldCheck, UserRound } from "lucide-react";

import { getCurrentUser } from "@/lib/auth-client";
import { findAccountProfileById } from "@/lib/users";
import ProfileEditor from "@/components/account/ProfileEditor";

function formatAddress(
  address:
    | {
        street: string | null;
        city: string | null;
        province: string | null;
        postalCode: string | null;
        country: string | null;
      }
    | null
) {
  if (!address) {
    return "No address saved yet.";
  }

  return [address.street, address.city, address.province, address.postalCode, address.country]
    .filter(Boolean)
    .join(", ");
}

export default async function ProfilePage() {
  const authUser = await getCurrentUser();
  const profile = authUser ? await findAccountProfileById(authUser.userId) : null;

  const joinedDate = profile
    ? new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
        new Date(profile.createdAt)
      )
    : "recently";

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(26,83,92,0.06)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-accent text-lg font-semibold text-white shadow-[0_16px_35px_rgba(255,107,53,0.2)]">
              {profile?.name?.slice(0, 1).toUpperCase() ?? "U"}
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                Profile
              </p>
              <h1 className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-[-0.04em] text-primary">
                {profile?.name ?? authUser?.name ?? "Your account"}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary sm:text-base">
                Review the details tied to your account before checkout and delivery.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-secondary">
            <span className="font-medium text-primary">Joined</span> {joinedDate}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-primary">Personal details</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Full name", value: profile?.name ?? authUser?.name ?? "Not set" },
              { label: "Email", value: profile?.email ?? authUser?.email ?? "Not set", icon: Mail },
              { label: "Role", value: profile?.role ?? authUser?.role ?? "user" },
              { label: "Account status", value: profile?.isActive ? "Active" : "Inactive", icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                    {item.label}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-medium text-primary">
                    {Icon ? <Icon className="h-4 w-4 text-accent" /> : null}
                    <span>{item.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-border bg-background/70 p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-semibold text-primary">Contact info</h2>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                  Phone
                </p>
                <p className="mt-2 text-primary">{profile?.phone ?? "Not added yet"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                  Email address
                </p>
                <p className="mt-2 text-primary">{profile?.email ?? authUser?.email ?? "Not set"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)]">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-semibold text-primary">Edit profile</h2>
              </div>
            </div>

            <ProfileEditor
              initialName={profile?.name ?? authUser?.name ?? ""}
              initialPhone={profile?.phone ?? null}
              initialAddress={profile?.address ?? null}
            />

            <Link
              href="/account"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-accent/30 hover:bg-accent/10"
            >
              <CalendarDays className="h-4 w-4 text-accent" />
              Back to dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
