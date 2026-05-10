import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Stethoscope, Star } from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Vet } from "@/lib/models/Vet";
import BookingForm from "./BookingForm";

export const metadata = {
  title: "Book Appointment | PetStore",
  description: "Book an appointment with one of our verified veterinarians.",
};

interface PageProps {
  params: Promise<{ vetId: string }>;
}

export default async function VetBookingPage({ params }: PageProps) {
  const { vetId } = await params;

  await connectToDatabase();

  const vetUser = await User.findOne({ _id: vetId, role: "vet", isActive: true }).lean<{
    _id: { toString(): string };
    name: string;
    email: string;
  }>();

  if (!vetUser) notFound();

  const vetProfile = await Vet.findOne({
    user: vetId,
    isVerified: true,
    isAvailable: true,
  }).lean<{
    specialization?: string;
    bio?: string;
    experience?: number;
    consultationFee?: number;
    timeSlots?: string[];
    availableDays?: string[];
  }>();

  if (!vetProfile) notFound();

  const timeSlots = vetProfile.timeSlots ?? [];
  const consultationFee = vetProfile.consultationFee ?? 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/vets"
        className="inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all vets
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Vet Profile Card */}
        <div className="space-y-6">
          {/* Hero card */}
          <div className="rounded-[32px] border border-border bg-surface p-8 shadow-[0_20px_60px_rgba(26,83,92,0.06)]">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-accent/10 text-accent">
                <Stethoscope className="h-10 w-10" />
              </div>
              <div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-700">
                  Verified Vet
                </span>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-primary">
                  {vetUser.name}
                </h1>
                <p className="mt-1 text-base text-accent">
                  {vetProfile.specialization ?? "General Practice"}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap gap-4">
              {vetProfile.experience !== undefined && (
                <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-background/60 px-4 py-3">
                  <Clock className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Experience
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {vetProfile.experience} years
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-background/60 px-4 py-3">
                <Star className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Consultation Fee
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    Rs. {consultationFee}
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            {vetProfile.bio && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">About</h2>
                <p className="mt-2 leading-relaxed text-secondary">{vetProfile.bio}</p>
              </div>
            )}

            {/* Available days */}
            {vetProfile.availableDays && vetProfile.availableDays.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
                  Available Days
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {vetProfile.availableDays.map((day) => (
                    <span
                      key={day}
                      className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Form Card */}
        <div className="rounded-[32px] border border-border bg-surface p-7 shadow-[0_20px_60px_rgba(26,83,92,0.06)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted">
            Schedule
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-primary">
            Book an Appointment
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            Fill in the details below and we&apos;ll confirm your slot.
          </p>

          <div className="mt-6">
            <BookingForm
              vetId={vetId}
              timeSlots={timeSlots}
              consultationFee={consultationFee}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
