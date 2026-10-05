"use client";

import useSWR from "swr";
import type { Mission } from "@kestrel/contracts";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const COLUMNS: Mission["status"][] = ["queued", "airspace_pending", "cleared", "in_flight", "delivered", "aborted", "returned"];

export default function MissionBoard() {
  const { data, error } = useSWR<Mission[]>("/api/missions", fetcher, { refreshInterval: 5000 });
  if (error) return <aside>Could not load missions.</aside>;

  return (
    <aside style={{ overflowY: "auto", padding: 16 }}>
      <h2>Mission board</h2>
      {COLUMNS.map((status) => (
        <section key={status}>
          <h3>{status.replaceAll("_", " ")}</h3>
          <ul>
            {(data ?? [])
              .filter((m) => m.status === status)
              .map((m) => (
                <li key={m.id}>
                  <a href={`/missions/${m.id}`}>{m.origin.name} to {m.destination.name}</a>{" "}
                  <small>{m.priority} / {m.payload.temperatureClass}</small>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}
