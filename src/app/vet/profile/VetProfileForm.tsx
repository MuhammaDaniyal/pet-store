"use client";

import { useState, useTransition } from "react";
import { Loader2, Save, Check } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface VetProfileFormProps {
  initialBio: string;
  initialSpecialization: string;
  initialFee: number;
  initialDays: string[];
  initialTimeSlots: string[];
}

export default function VetProfileForm({
  initialBio,
  initialSpecialization,
  initialFee,
  initialDays,
  initialTimeSlots,
}: VetProfileFormProps) {
  const [bio, setBio] = useState(initialBio);
  const [specialization, setSpecialization] = useState(initialSpecialization);
  const [fee, setFee] = useState(initialFee.toString());
  const [availableDays, setAvailableDays] = useState<string[]>(initialDays);
  const [timeSlotsRaw, setTimeSlotsRaw] = useState(initialTimeSlots.join(", "));
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function toggleDay(day: string) {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaved(false);

    const timeSlots = timeSlotsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      const res = await fetch("/api/vet/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          specialization,
          consultationFee: Number(fee),
          availableDays,
          timeSlots,
        }),
      });

      const data = (await res.json()) as { message?: string };

      if (!res.ok) {
        setError(data.message ?? "Failed to save profile.");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";
  const labelClass = "block text-sm font-medium text-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Specialization */}
      <div className="space-y-1.5">
        <label htmlFor="specialization" className={labelClass}>
          Specialization
        </label>
        <input
          id="specialization"
          type="text"
          placeholder="e.g. General Practice, Surgery, Exotic Animals"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <label htmlFor="bio" className={labelClass}>
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          placeholder="Tell clients a little about yourself and your experience…"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Consultation fee */}
      <div className="space-y-1.5">
        <label htmlFor="fee" className={labelClass}>
          Consultation Fee (Rs.)
        </label>
        <input
          id="fee"
          type="number"
          min={0}
          placeholder="e.g. 1500"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Available days */}
      <div className="space-y-2">
        <p className={labelClass}>Available Days</p>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const active = availableDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`rounded-2xl border px-4 py-2 text-xs font-semibold transition-all ${
                  active
                    ? "border-accent/40 bg-accent text-white shadow-[0_6px_18px_rgba(255,107,53,0.22)]"
                    : "border-border bg-background/60 text-primary hover:border-accent/30 hover:bg-accent/10"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div className="space-y-1.5">
        <label htmlFor="timeSlots" className={labelClass}>
          Time Slots
        </label>
        <input
          id="timeSlots"
          type="text"
          placeholder="09:00, 10:00, 11:00, 14:00, 15:00"
          value={timeSlotsRaw}
          onChange={(e) => setTimeSlotsRaw(e.target.value)}
          className={inputClass}
        />
        <p className="text-xs text-muted">Comma-separated 24h times, e.g. 09:00, 14:30</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent/90 hover:shadow-[0_8px_24px_rgba(255,107,53,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Saving…
          </>
        ) : saved ? (
          <>
            <Check className="h-4 w-4" /> Saved!
          </>
        ) : (
          <>
            <Save className="h-4 w-4" /> Save Changes
          </>
        )}
      </button>
    </form>
  );
}
