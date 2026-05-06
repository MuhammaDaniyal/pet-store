import { cookies } from "next/headers";
import { verifyToken, type AuthTokenPayload } from "./auth";

export async function getCurrentUser(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  return payload;
}
