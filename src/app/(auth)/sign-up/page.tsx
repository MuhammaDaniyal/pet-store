"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

type RegisterResponse = {
  message?: string;
  fieldErrors?: FieldErrors;
  email?: string;
  verificationCode?: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm() {
    const errors: FieldErrors = {};

    if (!name.trim()) errors.name = "Full name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm();
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        setFieldErrors(data.fieldErrors ?? { form: data.message ?? "Unable to create account." });
        return;
      }

      const verificationUrl = new URL("/sign-up/verify", window.location.origin);
      verificationUrl.searchParams.set("email", data.email ?? email);

      if (data.verificationCode && process.env.NODE_ENV !== "production") {
        verificationUrl.searchParams.set("code", data.verificationCode);
      }

      router.replace(`${verificationUrl.pathname}${verificationUrl.search}`);
    } catch {
      setFieldErrors({ form: "Unable to create account. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "w-full rounded-sm border border-border bg-surface px-4 py-3 text-primary placeholder:text-muted focus:border-[#0A0A0A] focus:outline-none";

  return (
    <section className="w-full max-w-md rounded-lg border border-border bg-surface p-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-primary">Create an account</h1>
        <p className="text-sm text-secondary">Join PetStore and find your perfect companion</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-primary">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClassName}
            placeholder="Alex Morgan"
          />
          {fieldErrors.name ? <p className="text-xs text-error">{fieldErrors.name}</p> : null}
        </div>

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
            className={inputClassName}
            placeholder="you@example.com"
          />
          {fieldErrors.email ? <p className="text-xs text-error">{fieldErrors.email}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-primary">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClassName}
            placeholder="Create a password"
          />
          {fieldErrors.password ? <p className="text-xs text-error">{fieldErrors.password}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-primary">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={inputClassName}
            placeholder="Repeat your password"
          />
          {fieldErrors.confirmPassword ? (
            <p className="text-xs text-error">{fieldErrors.confirmPassword}</p>
          ) : null}
        </div>

        {fieldErrors.form ? <p className="text-sm text-error">{fieldErrors.form}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-accent py-3 text-sm font-medium text-[#F5F4F0] transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}