"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginResponse = {
  role?: "user" | "admin" | "vet";
  message?: string;
};

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok || !data.role) {
        setError(data.message ?? "Unable to sign in.");
        return;
      }

      router.replace(
        data.role === "admin" ?
          "/admin/dashboard" :
          data.role === "vet" ?
            "/vet/dashboard" :
            "/"
      );
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full max-w-md rounded-lg border border-border bg-surface p-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-primary">Welcome back</h1>
        <p className="text-sm text-secondary">Sign in to your account</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-primary">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-primary placeholder:text-muted focus:border-[#0A0A0A] focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-primary">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-primary placeholder:text-muted focus:border-[#0A0A0A] focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        {error ? <p className="text-sm text-error">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-accent py-3 text-sm font-medium text-[#F5F4F0] transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </section>
  );
}