import { cookies } from "next/headers";
import { verifyAdmin } from "@/lib/auth";

export async function getAdmin() {
  const store = await cookies();
  const token = store.get("cm_admin")?.value;
  if (!token) return null;
  return verifyAdmin(token);
}
