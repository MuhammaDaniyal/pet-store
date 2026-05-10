import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import {
  createSignupVerification,
  deleteSignupVerificationByEmail,
} from "@/lib/signup-verifications";
import { findUserByEmail } from "@/lib/users";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  role?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
  };
  specialization?: string;
  experience?: number;
  consultationFee?: number;
  bio?: string;
  availableDays?: string[];
  timeSlots?: string[];
};

type RegisterResponse = {
  message: string;
  email: string;
  verificationCode?: string;
  expiresInMinutes: number;
};

function createFieldError(message: string) {
  return NextResponse.json(
    { message, fieldErrors: { form: message } },
    { status: 400 },
  );
}

export async function POST(request: Request) {
  let body: RegisterBody;

  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return createFieldError("Invalid request body.");
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const confirmPassword = body.confirmPassword ?? "";
  const phone = body.phone?.trim() ?? "";
  const role = body.role === "vet" ? "vet" : "user";
  const address = body.address ?? {};
  const street = address.street?.trim() ?? "";
  const city = address.city?.trim() ?? "";
  const province = address.province?.trim() ?? "";
  const postalCode = address.postalCode?.trim() ?? "";
  const country = address.country?.trim() ?? "";
  const specialization = body.specialization?.trim() ?? "";
  const experience = body.experience;
  const consultationFee = body.consultationFee;
  const bio = body.bio?.trim() ?? "";
  const availableDays = body.availableDays ?? [];
  const timeSlots = body.timeSlots ?? [];

  const fieldErrors: Record<string, string> = {};

  if (!name) fieldErrors.name = "Full name is required.";
  if (!email) fieldErrors.email = "Email is required.";
  if (!password) {
    fieldErrors.password = "Password is required.";
  }
  //  else if (password.length < 6) {
  //   fieldErrors.password = "Password must be at least 6 characters long.";
  // } else if (!/[A-Z]/.test(password)) {
  //   fieldErrors.password = "Password must contain at least one uppercase letter.";
  // } else if (!/[a-z]/.test(password)) {
  //   fieldErrors.password = "Password must contain at least one lowercase letter.";
  // } else if (!/[0-9]/.test(password)) {
  //   fieldErrors.password = "Password must contain at least one number.";
  // } else if (!/[^a-zA-Z0-9]/.test(password)) {
  //   fieldErrors.password = "Password must contain at least one special character.";
  // }
  if (!confirmPassword) fieldErrors.confirmPassword = "Please confirm your password.";
  if (password && confirmPassword && password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }
  if (!phone) {
    fieldErrors.phone = "Phone number is required.";
  } else if (!/^\+\d{8,15}$/.test(phone)) {
    fieldErrors.phone = "Enter a valid phone number in international format, like +923001234567.";
  }
  if (!street) fieldErrors.street = "Street address is required.";
  if (!city) fieldErrors.city = "City is required.";
  if (!province) fieldErrors.province = "Province is required.";
  if (!postalCode) fieldErrors.postalCode = "Postal code is required.";
  if (!country) fieldErrors.country = "Country is required.";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (role === "vet") {
    if (!specialization) fieldErrors.specialization = "Specialization is required.";
    if (typeof experience !== "number" || experience < 0) fieldErrors.experience = "Valid experience is required.";
    if (typeof consultationFee !== "number" || consultationFee < 0) fieldErrors.consultationFee = "Valid consultation fee is required.";
    if (!bio) fieldErrors.bio = "Professional bio is required.";

    if (!Array.isArray(availableDays) || availableDays.length === 0) {
      fieldErrors.availableDays = "Please select at least one available day.";
    }
    
    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
      fieldErrors.timeSlots = "Please enter valid time slots.";
    } else {
      const invalidSlot = timeSlots.find(slot => !/^([01]\d|2[0-3]):([0-5]\d)$/.test(slot));
      if (invalidSlot) {
        fieldErrors.timeSlots = `Invalid format (${invalidSlot}). Please use HH:MM format in 24h (e.g. 09:00).`;
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { message: "Please fix the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  // Defensive check: ensure no required signup fields are missing before creating verification
  const missing: Record<string, string> = {};
  if (!name) missing.name = "Full name is required.";
  if (!email) missing.email = "Email is required.";
  if (!password) missing.password = "Password is required.";
  if (!confirmPassword) missing.confirmPassword = "Please confirm your password.";
  if (!phone) missing.phone = "Phone number is required.";
  if (!street) missing.street = "Street address is required.";
  if (!city) missing.city = "City is required.";
  if (!province) missing.province = "Province is required.";
  if (!postalCode) missing.postalCode = "Postal code is required.";
  if (!country) missing.country = "Country is required.";

  if (Object.keys(missing).length > 0) {
    return NextResponse.json(
      { message: "Please fix the highlighted fields.", fieldErrors: missing },
      { status: 400 },
    );
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return NextResponse.json(
      {
        message: "An account with this email already exists.",
        fieldErrors: { email: "An account with this email already exists." },
      },
      { status: 409 },
    );
  }

  const hashedPassword = await hashPassword(password);

  await deleteSignupVerificationByEmail(email);

  const verification = await createSignupVerification({
    name,
    email,
    password: hashedPassword,
    phone,
    address: {
      street,
      city,
      province,
      postalCode,
      country,
    },
    role,
    ...(role === "vet" && {
      specialization,
      experience,
      consultationFee,
      bio,
      availableDays,
      timeSlots,
    }),
  });

  try {
    const sendResult = await sendVerificationEmail({
      name,
      email,
      code: verification.code,
    });

    const responseBody: RegisterResponse = {
      message: "We sent a verification code to your email.",
      email,
      expiresInMinutes: verification.expiresInMinutes,
      ...(sendResult.debugCode ? { verificationCode: sendResult.debugCode } : {}),
    };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    await deleteSignupVerificationByEmail(email);

    const message = error instanceof Error ? error.message : "Unable to send verification email.";
    return NextResponse.json(
      {
        message,
        fieldErrors: { form: message },
      },
      { status: 500 },
    );
  }
}