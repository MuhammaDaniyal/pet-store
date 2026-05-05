import { hashPassword, signToken } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/users";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
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

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    role: "user",
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({
    message: "Account created successfully.",
    role: user.role,
  });

  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}