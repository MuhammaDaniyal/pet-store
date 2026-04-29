import "server-only";

import { connectToDatabase } from "./db";
import { User } from "./models/User";

export type UserRole = "user" | "admin";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

export async function findUserByEmail(email: string) {
  await connectToDatabase();

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role as UserRole,
    createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
  } satisfies UserRecord;
}

export async function findUserById(id: string) {
  await connectToDatabase();

  const user = await User.findById(id);
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role as UserRole,
    createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
  } satisfies UserRecord;
}

export async function createUser(input: CreateUserInput) {
  await connectToDatabase();

  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password,
    role: input.role ?? "user",
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role as UserRole,
    createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
  } satisfies UserRecord;
}
