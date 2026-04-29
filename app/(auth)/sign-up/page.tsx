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

      router.replace("/sign-in");
    } catch {
      setFieldErrors({ form: "Unable to create account. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "w-full rounded-[6px] border border-[#D6D4CE] bg-[#EDECE8] px-4 py-3 text-[#0A0A0A] placeholder:text-[#8A8880] focus:border-[#0A0A0A] focus:outline-none";

  return (
    <section className="w-full max-w-md rounded-[16px] border border-[#D6D4CE] bg-[#EDECE8] p-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-[#0A0A0A]">Create an account</h1>
        <p className="text-sm text-[#4A4945]">Join PetStore and find your perfect companion</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-[#0A0A0A]">
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
          {fieldErrors.name ? <p className="text-xs text-[#C0392B]">{fieldErrors.name}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[#0A0A0A]">
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
          {fieldErrors.email ? <p className="text-xs text-[#C0392B]">{fieldErrors.email}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-[#0A0A0A]">
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
          {fieldErrors.password ? <p className="text-xs text-[#C0392B]">{fieldErrors.password}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-[#0A0A0A]">
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
            <p className="text-xs text-[#C0392B]">{fieldErrors.confirmPassword}</p>
          ) : null}
        </div>

        {fieldErrors.form ? <p className="text-sm text-[#C0392B]">{fieldErrors.form}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[10px] bg-[#0A0A0A] py-3 text-sm font-medium text-[#F5F4F0] transition-colors hover:bg-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#8A8880]">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-[#0A0A0A] underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}