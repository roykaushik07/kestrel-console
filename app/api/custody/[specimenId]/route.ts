import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

export async function GET(_req: Request, { params }: { params: Promise<{ specimenId: string }> }) {
  const { specimenId } = await params;
  const upstream = await gatewayFetch(`/v1/custody/${encodeURIComponent(specimenId)}`);
  return NextResponse.json(await upstream.json(), { status: upstream.status });
}
