import { redirect } from "next/navigation";
import { UserCog } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-client";
import { connectToDatabase } from "@/lib/db";
import { Vet } from "@/lib/models/Vet";
import VetProfileForm from "./VetProfileForm";

export const metadata = {
  title: "Profile & Schedule | Vet Dashboard",
};

interface VetDoc {
  specialization?: string;
  bio?: string;
  consultationFee?: number;
  availableDays?: string[];
  timeSlots?: string[];
}

export default async function VetProfilePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "vet") redirect("/");

  await connectToDatabase();

  const profile = await Vet.findOne({ user: user.userId }).lean<VetDoc>();

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[32px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(26,83,92,0.06)] sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <UserCog className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              Settings
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-primary">
              Profile &amp; Schedule
            </h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-secondary">
          Keep your bio, specialization, consultation fee, available days, and time slots up to
          date so clients can find and book you accurately.
        </p>
      </section>

      {!profile ? (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          <strong>Profile not set up yet.</strong> Fill in the form below to create your vet
          profile and start accepting bookings.
        </div>
      ) : null}

      {/* Form card */}
      <section className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(26,83,92,0.05)] sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
          Your details
        </p>
        <h2 className="mt-2 text-xl font-semibold text-primary">Edit Profile</h2>

        <div className="mt-6">
          <VetProfileForm
            initialBio={profile?.bio ?? ""}
            initialSpecialization={profile?.specialization ?? ""}
            initialFee={profile?.consultationFee ?? 0}
            initialDays={profile?.availableDays ?? []}
            initialTimeSlots={profile?.timeSlots ?? []}
          />
        </div>
      </section>
    </div>
  );
}
