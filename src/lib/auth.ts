import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE = "auth_token";

export type JWTPayload = {
  sub: string;
  role: "PATIENT" | "ADMIN";
  email: string;
};

export async function signAuth(payload: JWTPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify<JWTPayload>(token, secret);
    return payload;
  } catch {
    return null;
  }
}
