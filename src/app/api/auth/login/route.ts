import { comparePassword, signToken } from "@/lib/auth";
import { findUserByEmail } from "@/lib/users";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type LoginBody = {
  email?: string;
  password?: string;
};

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return errorResponse("Invalid request body.");
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return errorResponse("Email and password are required.");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return errorResponse("Invalid email or password.", 401);
  }

  const passwordMatches = await comparePassword(password, user.password);

  if (!passwordMatches) {
    return errorResponse("Invalid email or password.", 401);
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({
    role: user.role,
    message: "Signed in successfully.",
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