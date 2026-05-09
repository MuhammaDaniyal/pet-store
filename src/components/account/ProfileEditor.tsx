"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface ProfileEditorProps {
  initialName: string;
  initialPhone: string | null;
  initialAddress: {
    street: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    country: string | null;
  } | null;
}

export default function ProfileEditor({
  initialName,
  initialPhone,
  initialAddress,
}: ProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialName || "",
    phone: initialPhone || "",
    street: initialAddress?.street || "",
    city: initialAddress?.city || "",
    province: initialAddress?.province || "",
    postalCode: initialAddress?.postalCode || "",
    country: initialAddress?.country || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to update profile");
        return;
      }

      alert("Profile updated successfully!");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-accent/30 hover:bg-accent/10"
      >
        Edit Profile
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-primary">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder:text-muted focus:border-accent focus:outline-none"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder:text-muted focus:border-accent focus:outline-none"
            placeholder="Your phone number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary">Street Address</label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder:text-muted focus:border-accent focus:outline-none"
          placeholder="123 Main St"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-primary">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder:text-muted focus:border-accent focus:outline-none"
            placeholder="Your city"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary">Province</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder:text-muted focus:border-accent focus:outline-none"
            placeholder="Your province"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-primary">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder:text-muted focus:border-accent focus:outline-none"
            placeholder="Your postal code"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-primary placeholder:text-muted focus:border-accent focus:outline-none"
            placeholder="Your country"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="rounded-lg border border-border px-4 py-2.5 font-semibold text-primary transition-colors hover:bg-background/50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
