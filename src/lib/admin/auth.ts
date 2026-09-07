import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const SESSION_TTL = "7d";

// kept free of node builtins so the proxy can verify sessions on the edge.
function secret() {
  const value = process.env.ADMIN_SECRET;
  if (!value || value.length < 32) {
    throw new Error("ADMIN_SECRET must be set to at least 32 characters");
  }
  return new TextEncoder().encode(value);
}

export async function signSession() {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setAudience("session")
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(secret());
}

export async function verifySession(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret(), {
      audience: "session",
    });
    return payload.sub === "admin";
  } catch {
    return false;
  }
}
