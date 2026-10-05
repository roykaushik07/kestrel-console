import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Mission } from "@kestrel/contracts";
import { gatewayFetch } from "@/lib/gateway";

const NEW_ID = /^msn_[0-9A-HJKMNP-TV-Z]{26}$/;

const createSchema = z.object({
  originFacilityId: z.string(),
  destinationFacilityId: z.string(),
  priority: z.enum(["routine", "urgent", "stat"]),
  specimenIds: z.array(z.string()).min(1),
  temperatureClass: z.enum(["ambient", "refrigerated_2_8c", "frozen_minus20c", "cryogenic"]),
});

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  // Missions created before the dispatch migration use numeric ids and are
  // only resolvable through the legacy router.
  if (id && !NEW_ID.test(id)) {
    const legacy = await fetch(`${process.env.LEGACY_ROUTER_URL}/missions/${encodeURIComponent(id)}`);
    return NextResponse.json(await legacy.json(), { status: legacy.status });
  }

  const upstream = await gatewayFetch(id ? `/v1/missions/${id}` : "/v1/missions?active=true");
  const body = (await upstream.json()) as Mission | Mission[];
  return NextResponse.json(body, { status: upstream.status });
}

export async function POST(req: NextRequest) {
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }
  const upstream = await gatewayFetch("/v1/missions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data),
  });
  return NextResponse.json(await upstream.json(), { status: upstream.status });
}
