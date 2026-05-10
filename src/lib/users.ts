import "server-only";

import { connectToDatabase } from "./db";
import { User } from "./models/User";

export type UserRole = "user" | "admin" | "vet";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
};

export type AccountProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  phone: string | null;
  isActive: boolean;
  address: {
    street: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    country: string | null;
  } | null;
  wishlistCount: number;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
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

export async function findAccountProfileById(id: string) {
  await connectToDatabase();

  const user = await User.findById(id).select(
    "name email role phone address isActive wishlist createdAt"
  );

  if (!user) {
    return null;
  }

  const address = user.address as
    | {
        street?: string;
        city?: string;
        province?: string;
        postalCode?: string;
        country?: string;
      }
    | undefined;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
    phone: user.phone ?? null,
    isActive: user.isActive ?? true,
    address: address
      ? {
          street: address.street ?? null,
          city: address.city ?? null,
          province: address.province ?? null,
          postalCode: address.postalCode ?? null,
          country: address.country ?? null,
        }
      : null,
    wishlistCount: Array.isArray(user.wishlist) ? user.wishlist.length : 0,
  } satisfies AccountProfile;
}

export async function createUser(input: CreateUserInput) {
  await connectToDatabase();

  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password,
    phone: input.phone,
    address: input.address,
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
