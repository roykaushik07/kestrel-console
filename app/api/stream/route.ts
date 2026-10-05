import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Relay the gateway's telemetry SSE feed to the browser. */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("unauthorized", { status: 401 });

  const upstream = await fetch(`${env.NEXT_PUBLIC_API_URL}/v1/telemetry/stream`, {
    headers: { authorization: `Bearer ${session.accessToken}`, accept: "text/event-stream" },
    signal: req.signal,
  });
  if (!upstream.ok || !upstream.body) {
    return new Response("gateway stream unavailable", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
