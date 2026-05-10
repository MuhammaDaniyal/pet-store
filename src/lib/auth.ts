import "server-only";

import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";

export type AuthTokenPayload = {
  userId: string;
  name: string;
  email: string;
  role: "user" | "admin" | "vet";
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return secret;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export function signToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (!decoded || typeof decoded === "string") {
      return null;
    }

    const payload = decoded as JwtPayload & Partial<AuthTokenPayload>;

    if (
      typeof payload.userId !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "user" && payload.role !== "admin" && payload.role !== "vet")
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    } satisfies AuthTokenPayload;
  } catch {
    return null;
  }
}