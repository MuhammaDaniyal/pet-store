import { verifyToken } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const payload = verifyToken(token);

  if (!payload) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.set({ name: "token", value: "", path: "/", maxAge: 0 });
    return response;
  }

  if (pathname.startsWith("/vet") && payload.role !== "vet" && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/admin") && payload.role === "user") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/cart", "/checkout", "/admin/:path*", "/vet/:path*"],
};