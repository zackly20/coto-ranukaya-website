import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = (await req.json()) ?? {};
  if (!email || !password)
    return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });

  const user = await db.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });
  if (!user || !(await bcrypt.compare(String(password), user.password)))
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });

  const token = await signAdmin({ id: user.id, email: user.email, name: user.name });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("cm_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
