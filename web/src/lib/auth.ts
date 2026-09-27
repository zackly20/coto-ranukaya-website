import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-secret-coto-ranukaya-change-me"
);

export type AdminPayload = { id: number; email: string; name: string };

export async function signAdmin(payload: AdminPayload) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdmin(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.email !== "string" || typeof payload.id !== "number")
      return null;
    return {
      id: payload.id as number,
      email: payload.email,
      name: (payload.name as string) ?? "Admin",
    };
  } catch {
    return null;
  }
}
