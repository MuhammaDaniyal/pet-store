"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

type VerifyResponse = {
  role?: "user" | "admin";
  message?: string;
  fieldErrors?: {
    email?: string;
    code?: string;
  };
};

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = (await response.json()) as VerifyResponse;

      if (!response.ok || !data.role) {
        setError(data.message ?? data.fieldErrors?.code ?? "Unable to verify account.");
        return;
      }

      router.replace(data.role === "admin" ? "/admin" : "/");
    } catch {
      setError("Unable to verify account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full max-w-md rounded-lg border border-border bg-surface p-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-primary">Verify your email</h1>
        <p className="text-sm text-secondary">Enter the code we sent before your account is created.</p>
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
          <label htmlFor="code" className="text-sm font-medium text-primary">
            Verification code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-primary placeholder:text-muted focus:border-[#0A0A0A] focus:outline-none"
            placeholder="123456"
          />
        </div>

        {error ? <p className="text-sm text-error">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-accent py-3 text-sm font-medium text-[#F5F4F0] transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Verifying..." : "Verify account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already verified?{" "}
        <Link href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}

export default function VerifySignUpPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
