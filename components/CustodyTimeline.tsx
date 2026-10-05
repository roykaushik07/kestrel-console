"use client";

import useSWR from "swr";
import type { CustodyEvent } from "@kestrel/contracts";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CustodyTimeline({ specimenId }: { specimenId: string }) {
  const { data } = useSWR<CustodyEvent[]>(`/api/custody/${specimenId}`, fetcher);

  return (
    <ol>
      {(data ?? []).map((e) => (
        <li key={e.eventId} style={{ color: e.type === "temperature_excursion" ? "#e5484d" : undefined }}>
          <time dateTime={e.occurredAt}>{new Date(e.occurredAt).toLocaleString()}</time>{" "}
          {e.type.replaceAll("_", " ")} by {e.actor.displayName ?? e.actor.id}
          {e.payloadTempCelsius !== undefined && <> ({e.payloadTempCelsius.toFixed(1)} C)</>}
        </li>
      ))}
    </ol>
  );
}
