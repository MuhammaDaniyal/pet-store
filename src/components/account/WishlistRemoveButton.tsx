"use client";

import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

interface WishlistRemoveButtonProps {
  productId: string;
}

export default function WishlistRemoveButton({ productId }: WishlistRemoveButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        alert("Failed to remove from wishlist");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Remove error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg bg-red-100 text-red-600 px-3 py-2 text-sm transition-colors hover:bg-red-200 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
