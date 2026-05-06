import { signToken } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/users";
import { verifySignupVerificationCode } from "@/lib/signup-verifications";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type VerifyBody = {
  email?: string;
  code?: string;
};

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request: Request) {
  let body: VerifyBody;

  try {
    body = (await request.json()) as VerifyBody;
  } catch {
    return errorResponse("Invalid request body.");
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const code = body.code?.trim() ?? "";

  if (!email || !code) {
    return errorResponse("Email and verification code are required.");
  }

  const verificationResult = await verifySignupVerificationCode(email, code);

  if (verificationResult.status === "missing") {
    return errorResponse("Verification code not found. Please request a new one.", 404);
  }

  if (verificationResult.status === "expired") {
    return errorResponse("Verification code expired. Please sign up again.", 410);
  }

  if (verificationResult.status === "invalid") {
    return NextResponse.json(
      {
        message: "Incorrect verification code.",
        fieldErrors: {
          code: `Incorrect verification code. ${verificationResult.attemptsLeft} attempts left.`,
        },
      },
      { status: 400 },
    );
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return errorResponse("An account with this email already exists.", 409);
  }

  const user = await createUser({
    name: verificationResult.signup.name,
    email: verificationResult.signup.email,
    password: verificationResult.signup.password,
    role: "user",
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({
    message: "Account verified and created successfully.",
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
