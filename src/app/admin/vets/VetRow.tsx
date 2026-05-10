"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function VetRow({ vet }: { vet: any }) {
  const [isVerified, setIsVerified] = useState(vet.isVerified);
  const [isPending, setIsPending] = useState(false);

  const toggleVerify = async () => {
    setIsPending(true);
    try {
      const res = await fetch(`/api/admin/vets/${vet._id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !isVerified }),
      });
      if (res.ok) {
        setIsVerified(!isVerified);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
      <td className="px-6 py-4 text-sm font-medium text-primary">{vet.user?.name ?? "Unknown"}</td>
      <td className="px-6 py-4 text-sm text-secondary">{vet.user?.email ?? "Unknown"}</td>
      <td className="px-6 py-4 text-sm text-secondary">{vet.specialization || "-"}</td>
      <td className="px-6 py-4 text-sm text-secondary">${vet.consultationFee || 0}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold ${isVerified ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
          {isVerified ? "Verified" : "Pending"}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={toggleVerify}
          disabled={isPending}
          className="inline-flex w-[80px] justify-center items-center rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : (isVerified ? "Unverify" : "Verify")}
        </button>
      </td>
    </tr>
  );
}
