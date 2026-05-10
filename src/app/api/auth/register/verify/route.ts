import { signToken } from "@/lib/auth";
import { createUser, findUserByEmail, UserRole } from "@/lib/users";
import { verifySignupVerificationCode } from "@/lib/signup-verifications";
import { NextResponse } from "next/server";
import { Vet } from "@/lib/models/Vet";

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

  const signup = verificationResult.signup;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return errorResponse("An account with this email already exists.", 409);
  }

  const user = await createUser({
    name: signup.name,
    email: signup.email,
    password: signup.password,
    phone: signup.phone,
    address: signup.address,
    role: signup.role as UserRole,
  });

  if (signup.role === "vet") {
    await Vet.create({
      user: user.id,
      isVerified: false,
      specialization: signup.specialization,
      experience: signup.experience,
      consultationFee: signup.consultationFee,
      bio: signup.bio,
      availableDays: signup.availableDays,
      timeSlots: signup.timeSlots,
    });
  }

  const response = NextResponse.json({
    message: "Account verified and created successfully.",
    role: user.role,
  });

  // Only log in the user automatically if they are not a vet pending approval
  if (signup.role !== "vet") {
    const token = signToken({
      userId: user.id,
      name: user.name,
      email: user.email,
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
  }

  return response;
}
