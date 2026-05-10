"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2 } from "lucide-react";

interface BookingFormProps {
  vetId: string;
  timeSlots: string[];
  consultationFee: number;
}

export default function BookingForm({ vetId, timeSlots, consultationFee }: BookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    petName: "",
    petDescription: "",
    type: "consultation" as "consultation" | "grooming" | "checkup",
    date: "",
    timeSlot: timeSlots[0] ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, vetId, fee: consultationFee }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Failed to book appointment.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/account/appointments"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[28px] border border-emerald-200 bg-emerald-50 px-8 py-12 text-center">
        <div className="rounded-full bg-emerald-100 p-4">
          <CalendarDays className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-emerald-900">Appointment Requested!</h3>
        <p className="text-sm text-emerald-700">
          Your appointment is pending confirmation. Redirecting to your appointments…
        </p>
      </div>
    );
  }

  // Get today's date in YYYY-MM-DD format for the min date attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Pet Name */}
      <div className="space-y-1.5">
        <label htmlFor="petName" className="block text-sm font-medium text-primary">
          Pet Name
        </label>
        <input
          id="petName"
          name="petName"
          type="text"
          required
          placeholder="e.g. Fluffy"
          value={formData.petName}
          onChange={handleChange}
          className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {/* Pet Description */}
      <div className="space-y-1.5">
        <label htmlFor="petDescription" className="block text-sm font-medium text-primary">
          Pet Description
        </label>
        <input
          id="petDescription"
          name="petDescription"
          type="text"
          required
          placeholder="e.g. Persian Cat, 3 years old, not eating well"
          value={formData.petDescription}
          onChange={handleChange}
          className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {/* Appointment Type */}
      <div className="space-y-1.5">
        <label htmlFor="type" className="block text-sm font-medium text-primary">
          Appointment Type
        </label>
        <select
          id="type"
          name="type"
          required
          value={formData.type}
          onChange={handleChange}
          className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        >
          <option value="consultation">Consultation</option>
          <option value="grooming">Grooming</option>
          <option value="checkup">Check-up</option>
        </select>
      </div>

      {/* Date */}
      <div className="space-y-1.5">
        <label htmlFor="date" className="block text-sm font-medium text-primary">
          Preferred Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          min={today}
          value={formData.date}
          onChange={handleChange}
          className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {/* Time Slot */}
      <div className="space-y-1.5">
        <label htmlFor="timeSlot" className="block text-sm font-medium text-primary">
          Time Slot
        </label>
        {timeSlots.length === 0 ? (
          <p className="text-sm text-muted italic">No time slots configured for this vet.</p>
        ) : (
          <select
            id="timeSlot"
            name="timeSlot"
            required
            value={formData.timeSlot}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting || timeSlots.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent/90 hover:shadow-[0_8px_24px_rgba(255,107,53,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Booking…
          </>
        ) : (
          <>
            <CalendarDays className="h-4 w-4" /> Confirm Booking
          </>
        )}
      </button>
    </form>
  );
}
