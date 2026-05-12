import Link from "next/link";
import { Stethoscope, Star, Clock, ArrowRight, CalendarDays } from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Vet } from "@/lib/models/Vet";
import { getCurrentUser } from "@/lib/auth-client";
import { redirect } from "next/navigation";

interface VetProfile {
  _id: string;
  name: string;
  email: string;
  specialization?: string;
  experience?: number;
  consultationFee?: number;
  bio?: string;
  isVerified: boolean;
  isAvailable: boolean;
}

export const metadata = {
  title: "Find a Vet | MD PawVita",
  description: "Browse our network of verified, experienced veterinarians and book an appointment today.",
};

export default async function VetsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/sign-in");
  }

  await connectToDatabase();

  // Get all users with role "vet"
  const vetUsers = await User.find({ role: "vet", isActive: true }).lean<
    { _id: { toString(): string }; name: string; email: string }[]
  >();

  const vetUserIds = vetUsers.map((u) => u._id);

  // Get their verified & available Vet profiles
  const vetProfiles = await Vet.find({
    user: { $in: vetUserIds },
    isVerified: true,
    isAvailable: true,
  }).lean<
    {
      _id: { toString(): string };
      user: { toString(): string };
      specialization?: string;
      experience?: number;
      consultationFee?: number;
      bio?: string;
      isVerified: boolean;
      isAvailable: boolean;
    }[]
  >();

  // Merge user info with vet profile
  const vets: VetProfile[] = vetProfiles.map((profile) => {
    const user = vetUsers.find((u) => u._id.toString() === profile.user.toString());
    return {
      _id: profile.user.toString(),
      name: user?.name ?? "Unknown",
      email: user?.email ?? "",
      specialization: profile.specialization,
      experience: profile.experience,
      consultationFee: profile.consultationFee,
      bio: profile.bio,
      isVerified: profile.isVerified,
      isAvailable: profile.isAvailable,
    };
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted">
          Veterinary Care
        </p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.04em] text-primary">
          Find your pet&apos;s perfect vet
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-secondary">
          Browse our network of verified, experienced veterinarians. Book an appointment in minutes.
        </p>
      </div>

      {vets.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-6 rounded-[32px] border border-border bg-surface px-8 py-24 text-center shadow-[0_20px_60px_rgba(26,83,92,0.06)]">
          <div className="rounded-full border border-accent/20 bg-accent/10 p-6">
            <Stethoscope className="h-10 w-10 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-primary">No vets available</h2>
            <p className="mt-2 text-sm text-secondary">
              We&apos;re onboarding new veterinarians. Please check back soon!
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Back to Home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vets.map((vet) => (
            <div
              key={vet._id}
              className="group flex flex-col rounded-[28px] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(26,83,92,0.12)]"
            >
              {/* Avatar */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-semibold text-primary">{vet.name}</h2>
                  <p className="mt-0.5 text-sm text-accent">
                    {vet.specialization ?? "General Practice"}
                  </p>
                </div>
                {/* Verified badge */}
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                  Verified
                </span>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {vet.experience !== undefined && (
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2.5">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-muted" />
                    <span className="text-xs font-medium text-secondary">
                      {vet.experience} yr{vet.experience !== 1 ? "s" : ""} exp.
                    </span>
                  </div>
                )}
                {vet.consultationFee !== undefined && (
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2.5">
                    <Star className="h-3.5 w-3.5 shrink-0 text-muted" />
                    <span className="text-xs font-medium text-secondary">
                      Rs. {vet.consultationFee} / visit
                    </span>
                  </div>
                )}
              </div>

              {/* Bio snippet */}
              {vet.bio && (
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-secondary">
                  {vet.bio}
                </p>
              )}

              {/* CTA */}
              <div className="mt-auto pt-6">
                <Link
                  href={`/vets/${vet._id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent/90 hover:shadow-[0_8px_24px_rgba(255,107,53,0.3)]"
                >
                  <CalendarDays className="h-4 w-4" />
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
