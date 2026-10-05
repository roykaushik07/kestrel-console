import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { env } from "@/lib/env";

/** Fetch from the gateway on behalf of the signed-in operator. */
export async function gatewayFetch(path: string, init: RequestInit = {}) {
  const session = await getServerSession(authOptions);
  const headers = new Headers(init.headers);
  if (session?.accessToken) headers.set("authorization", `Bearer ${session.accessToken}`);
  return fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, { ...init, headers });
}
