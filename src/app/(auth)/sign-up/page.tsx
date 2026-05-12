"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  consultationFee?: string;
  bio?: string;
  availableDays?: string;
  timeSlots?: string;
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
  const [phoneDigits, setPhoneDigits] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("user");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [bio, setBio] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [timeSlotsRaw, setTimeSlotsRaw] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const phoneNumber = phoneDigits ? `+${phoneDigits}` : "";

  function handlePhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPhoneDigits(event.target.value.replace(/\D/g, ""));
  }

  function validatePhoneNumber(value: string) {
    return /^\+\d{8,15}$/.test(value);
  }

  function validateForm() {
    const errors: FieldErrors = {};

    if (!name.trim()) errors.name = "Full name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!phoneDigits) {
      errors.phone = "Phone number is required.";
    } else if (!validatePhoneNumber(phoneNumber)) {
      errors.phone = "Enter a valid phone number in international format, like +923001234567.";
    }
    if (!street.trim()) errors.street = "Street address is required.";
    if (!city.trim()) errors.city = "City is required.";
    if (!province.trim()) errors.province = "Province is required.";
    if (!postalCode.trim()) errors.postalCode = "Postal code is required.";
    if (!country.trim()) errors.country = "Country is required.";

    if (role === "vet") {
      if (!specialization.trim()) errors.specialization = "Specialization is required.";
      if (!experience.trim()) errors.experience = "Experience is required.";
      else if (isNaN(Number(experience)) || Number(experience) < 0) errors.experience = "Must be a valid positive number.";
      
      if (!consultationFee.trim()) errors.consultationFee = "Consultation fee is required.";
      else if (isNaN(Number(consultationFee)) || Number(consultationFee) < 0) errors.consultationFee = "Must be a valid positive number.";
      
      if (!bio.trim()) errors.bio = "Professional bio is required.";

      if (availableDays.length === 0) errors.availableDays = "Please select at least one available day.";
      
      if (!timeSlotsRaw.trim()) {
        errors.timeSlots = "Please enter your time slots.";
      } else {
        const slots = timeSlotsRaw.split(",").map(s => s.trim()).filter(Boolean);
        if (slots.length === 0) {
          errors.timeSlots = "Please enter valid time slots.";
        } else {
          const invalidSlot = slots.find(slot => !/^([01]\d|2[0-3]):([0-5]\d)$/.test(slot));
          if (invalidSlot) {
            errors.timeSlots = `Invalid format (${invalidSlot}). Please use HH:MM format in 24h (e.g. 09:00).`;
          }
        }
      }
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
          phone: phoneNumber,
          role,
          ...(role === "vet" && {
            specialization,
            experience: Number(experience),
            consultationFee: Number(consultationFee),
            bio,
            availableDays,
            timeSlots: timeSlotsRaw.split(",").map(s => s.trim()).filter(Boolean)
          }),
          address: {
            street,
            city,
            province,
            postalCode,
            country,
          },
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
    <section className="w-full max-w-3xl rounded-lg border border-border bg-surface p-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-primary">Create an account</h1>
        <p className="text-sm text-secondary">Join MD PawVita and find your perfect companion</p>
      </div>

      <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="role" className="text-sm font-medium text-primary">
            Account Type
          </label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-primary focus:border-[#0A0A0A] focus:outline-none appearance-none"
          >
            <option value="user">Pet Owner</option>
            <option value="vet">Veterinarian</option>
          </select>
        </div>

        {role === "vet" && (
          <>
            <div className="space-y-2 sm:col-span-2">
              <div className="my-2 h-px w-full bg-border" />
              <h2 className="text-lg font-medium text-primary">Professional Details</h2>
              <p className="text-sm text-secondary">Please provide your veterinary details for verification.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="specialization" className="text-sm font-medium text-primary">
                Specialization
              </label>
              <input
                id="specialization"
                name="specialization"
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className={inputClassName}
                placeholder="e.g. Small Animal Surgery"
              />
              {fieldErrors.specialization ? <p className="text-xs text-error">{fieldErrors.specialization}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="experience" className="text-sm font-medium text-primary">
                Years of Experience
              </label>
              <input
                id="experience"
                name="experience"
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className={inputClassName}
                placeholder="e.g. 5"
              />
              {fieldErrors.experience ? <p className="text-xs text-error">{fieldErrors.experience}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="consultationFee" className="text-sm font-medium text-primary">
                Consultation Fee (Rs.)
              </label>
              <input
                id="consultationFee"
                name="consultationFee"
                type="number"
                min="0"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                className={inputClassName}
                placeholder="e.g. 1500"
              />
              {fieldErrors.consultationFee ? <p className="text-xs text-error">{fieldErrors.consultationFee}</p> : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="bio" className="text-sm font-medium text-primary">
                Professional Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={`${inputClassName} resize-none`}
                placeholder="Tell us about your background and experience..."
              />
              {fieldErrors.bio ? <p className="text-xs text-error">{fieldErrors.bio}</p> : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <p className="text-sm font-medium text-primary">Available Days</p>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const active = availableDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setAvailableDays((prev) => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
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
              {fieldErrors.availableDays ? <p className="text-xs text-error">{fieldErrors.availableDays}</p> : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="timeSlots" className="text-sm font-medium text-primary">
                Time Slots
              </label>
              <input
                id="timeSlots"
                name="timeSlots"
                type="text"
                placeholder="09:00, 10:00, 11:00, 14:00, 15:00"
                value={timeSlotsRaw}
                onChange={(e) => setTimeSlotsRaw(e.target.value)}
                className={inputClassName}
              />
              <p className="text-xs text-muted">Comma-separated 24h times, e.g. 09:00, 14:30</p>
              {fieldErrors.timeSlots ? <p className="text-xs text-error">{fieldErrors.timeSlots}</p> : null}
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <div className="my-2 h-px w-full bg-border" />
            </div>
          </>
        )}

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

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="phone" className="text-sm font-medium text-primary">
            Phone number
          </label>
          <div className="flex overflow-hidden rounded-sm border border-border bg-surface focus-within:border-[#0A0A0A]">
            <span className="flex items-center border-r border-border px-4 text-sm text-muted">+</span>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phoneDigits}
              onChange={handlePhoneChange}
              className="w-full bg-transparent px-4 py-3 text-primary placeholder:text-muted focus:outline-none"
              placeholder="923001234567"
              maxLength={15}
            />
          </div>
          {fieldErrors.phone ? <p className="text-xs text-error">{fieldErrors.phone}</p> : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="street" className="text-sm font-medium text-primary">
            Street address
          </label>
          <input
            id="street"
            name="street"
            type="text"
            autoComplete="street-address"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
            className={inputClassName}
            placeholder="123 Main Street"
          />
          {fieldErrors.street ? <p className="text-xs text-error">{fieldErrors.street}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium text-primary">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className={inputClassName}
            placeholder="Lahore"
          />
          {fieldErrors.city ? <p className="text-xs text-error">{fieldErrors.city}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="province" className="text-sm font-medium text-primary">
            Province / state
          </label>
          <input
            id="province"
            name="province"
            type="text"
            autoComplete="address-level1"
            value={province}
            onChange={(event) => setProvince(event.target.value)}
            className={inputClassName}
            placeholder="Punjab"
          />
          {fieldErrors.province ? <p className="text-xs text-error">{fieldErrors.province}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="postalCode" className="text-sm font-medium text-primary">
            Postal code
          </label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            autoComplete="postal-code"
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            className={inputClassName}
            placeholder="54000"
          />
          {fieldErrors.postalCode ? <p className="text-xs text-error">{fieldErrors.postalCode}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium text-primary">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            autoComplete="country-name"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className={inputClassName}
            placeholder="Pakistan"
          />
          {fieldErrors.country ? <p className="text-xs text-error">{fieldErrors.country}</p> : null}
        </div>

        {fieldErrors.form ? <p className="text-sm text-error sm:col-span-2">{fieldErrors.form}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-accent py-3 text-sm font-medium text-[#F5F4F0] transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2"
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