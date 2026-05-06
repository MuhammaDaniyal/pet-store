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

  const fieldErrors: Record<string, string> = {};

  if (!name) fieldErrors.name = "Full name is required.";
  if (!email) fieldErrors.email = "Email is required.";
  if (!password) {
    fieldErrors.password = "Password is required.";
  } else if (password.length < 6) {
    fieldErrors.password = "Password must be at least 6 characters long.";
  } else if (!/[A-Z]/.test(password)) {
    fieldErrors.password = "Password must contain at least one uppercase letter.";
  } else if (!/[a-z]/.test(password)) {
    fieldErrors.password = "Password must contain at least one lowercase letter.";
  } else if (!/[0-9]/.test(password)) {
    fieldErrors.password = "Password must contain at least one number.";
  } else if (!/[^a-zA-Z0-9]/.test(password)) {
    fieldErrors.password = "Password must contain at least one special character.";
  }
  if (!confirmPassword) fieldErrors.confirmPassword = "Please confirm your password.";
  if (password && confirmPassword && password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { message: "Please fix the highlighted fields.", fieldErrors },
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