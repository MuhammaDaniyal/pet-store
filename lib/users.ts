import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

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

const usersFilePath = path.join(process.cwd(), "data", "users.json");

async function ensureUsersFile() {
  await mkdir(path.dirname(usersFilePath), { recursive: true });

  try {
    await readFile(usersFilePath, "utf8");
  } catch {
    await writeFile(usersFilePath, "[]\n", "utf8");
  }
}

async function readUsers(): Promise<UserRecord[]> {
  await ensureUsersFile();

  const fileContents = await readFile(usersFilePath, "utf8");

  try {
    const parsed = JSON.parse(fileContents) as unknown;
    return Array.isArray(parsed) ? (parsed as UserRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: UserRecord[]) {
  await ensureUsersFile();
  await writeFile(usersFilePath, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((user) => user.email === email) ?? null;
}

export async function createUser(input: CreateUserInput) {
  const users = await readUsers();
  const user: UserRecord = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    password: input.password,
    role: input.role ?? "user",
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);

  return user;
}
