import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
} from "@/lib/admin/auth";
import { verifyPassword } from "@/lib/admin/password";
import { clearFailures, isThrottled, recordFailure } from "@/lib/admin/throttle";

function clientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || "local";
}

function back(request: NextRequest, error: string) {
  return NextResponse.redirect(
    new URL(`/admin/login?error=${error}`, request.url),
    303
  );
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);
  if (isThrottled(key)) return back(request, "throttled");

  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) return back(request, "unconfigured");

  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  if (!verifyPassword(password, stored)) {
    recordFailure(key);
    return back(request, "invalid");
  }

  clearFailures(key);
  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(SESSION_COOKIE, await signSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
