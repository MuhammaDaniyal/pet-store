import "server-only";

import { randomInt } from "crypto";

import { connectToDatabase } from "./db";
import { comparePassword, hashPassword } from "./auth";
import { SignupVerification } from "./models/SignupVerification";

const VERIFICATION_CODE_LENGTH = 6;
const VERIFICATION_CODE_EXPIRY_MINUTES = 15;
const MAX_VERIFICATION_ATTEMPTS = 5;

export type CreateSignupVerificationInput = {
  name: string;
  email: string;
  password: string;
};

export type VerificationCheckResult =
  | {
      status: "verified";
      signup: CreateSignupVerificationInput;
    }
  | {
      status: "missing";
    }
  | {
      status: "expired";
    }
  | {
      status: "invalid";
      attemptsLeft: number;
    };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createVerificationCode() {
  const maximum = 10 ** VERIFICATION_CODE_LENGTH;
  return randomInt(maximum).toString().padStart(VERIFICATION_CODE_LENGTH, "0");
}

export async function deleteSignupVerificationByEmail(email: string) {
  await connectToDatabase();
  await SignupVerification.deleteOne({ email: normalizeEmail(email) });
}

export async function createSignupVerification(input: CreateSignupVerificationInput) {
  await connectToDatabase();

  const code = createVerificationCode();
  const codeHash = await hashPassword(code);
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000);

  await SignupVerification.create({
    name: input.name,
    email: normalizeEmail(input.email),
    password: input.password,
    codeHash,
    attempts: 0,
    expiresAt,
  });

  return {
    code,
    expiresInMinutes: VERIFICATION_CODE_EXPIRY_MINUTES,
  };
}

export async function verifySignupVerificationCode(
  email: string,
  code: string,
): Promise<VerificationCheckResult> {
  await connectToDatabase();

  const pending = await SignupVerification.findOne({ email: normalizeEmail(email) });

  if (!pending) {
    return { status: "missing" };
  }

  if (pending.expiresAt.getTime() <= Date.now()) {
    await pending.deleteOne();
    return { status: "expired" };
  }

  const matches = await comparePassword(code.trim(), pending.codeHash);

  if (!matches) {
    pending.attempts += 1;

    if (pending.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      await pending.deleteOne();
      return { status: "expired" };
    }

    await pending.save();

    return {
      status: "invalid",
      attemptsLeft: MAX_VERIFICATION_ATTEMPTS - pending.attempts,
    };
  }

  const signup = {
    name: pending.name,
    email: pending.email,
    password: pending.password,
  } satisfies CreateSignupVerificationInput;

  await pending.deleteOne();

  return { status: "verified", signup };
}
