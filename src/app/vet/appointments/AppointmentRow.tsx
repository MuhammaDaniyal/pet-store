"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, XCircle, Stethoscope } from "lucide-react";

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface AppointmentRowProps {
  id: string;
  clientName: string;
  petName: string;
  petDescription?: string;
  type: string;
  date: string;
  timeSlot: string;
  initialStatus: AppointmentStatus;
}

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-sky-50 text-sky-700 border-sky-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

function AppointmentRow({
  id,
  clientName,
  petName,
  petDescription,
  type,
  date,
  timeSlot,
  initialStatus,
}: AppointmentRowProps) {
  const [status, setStatus] = useState<AppointmentStatus>(initialStatus);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function updateStatus(newStatus: AppointmentStatus) {
    setError("");
    setIsPending(true);
    try {
      const res = await fetch(`/api/vet/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
      } else {
        const data = (await res.json()) as { message?: string };
        setError(data.message ?? "Update failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(26,83,92,0.04)] sm:flex-row sm:items-center sm:justify-between">
      {/* Info */}
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">{clientName}</p>
          <p className="mt-0.5 text-xs text-secondary capitalize">{type}</p>
          <p className="text-xs font-medium text-primary">{petName}</p>
          {petDescription && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{petDescription}</p>
          )}
        </div>
      </div>

      {/* Date / time */}
      <div className="text-sm text-secondary">
        <span className="font-medium text-primary">{date}</span>
        {" · "}
        {timeSlot}
      </div>

      {/* Status badge */}
      <span
        className={`shrink-0 self-start rounded-full border px-3 py-1 text-xs font-semibold capitalize sm:self-auto ${STATUS_STYLES[status]}`}
      >
        {status}
      </span>

      {/* Action buttons */}
      <div className="flex shrink-0 flex-wrap gap-2">
        {status === "pending" && (
          <>
            <button
              onClick={() => updateStatus("confirmed")}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 transition-colors hover:bg-sky-100 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
              Confirm
            </button>
            <button
              onClick={() => updateStatus("cancelled")}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
              Cancel
            </button>
          </>
        )}
        {status === "confirmed" && (
          <button
            onClick={() => updateStatus("completed")}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
            Mark Completed
          </button>
        )}
      </div>

      {error && <p className="w-full text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default AppointmentRow;
