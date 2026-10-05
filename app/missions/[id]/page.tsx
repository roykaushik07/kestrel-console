import { notFound } from "next/navigation";
import type { Mission } from "@kestrel/contracts";
import CustodyTimeline from "@/components/CustodyTimeline";
import { gatewayFetch } from "@/lib/gateway";

export const dynamic = "force-dynamic";

export default async function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await gatewayFetch(`/v1/missions/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`gateway returned ${res.status} for mission ${id}`);
  const mission = (await res.json()) as Mission;

  return (
    <main style={{ padding: 24 }}>
      <h1>Mission {mission.id}</h1>
      <p>
        <strong>{mission.status.replaceAll("_", " ")}</strong> / {mission.priority}
        {mission.droneId && <> / drone {mission.droneId}</>}
      </p>
      <p>
        {mission.origin.name} to {mission.destination.name}
        {mission.etaSeconds !== undefined && <> (ETA {Math.ceil(mission.etaSeconds / 60)} min)</>}
      </p>

      <h2>Payload</h2>
      <dl>
        <dt>Kind</dt>
        <dd>{mission.payload.kind.replaceAll("_", " ")}</dd>
        <dt>Temperature class</dt>
        <dd>{mission.payload.temperatureClass.replaceAll("_", " ")}</dd>
        <dt>Mass</dt>
        <dd>{mission.payload.massGrams} g</dd>
      </dl>

      <h2>Chain of custody</h2>
      {mission.payload.specimenIds.map((specimenId) => (
        <section key={specimenId}>
          <h3>
            <a href={`/specimens/${specimenId}`}>Specimen {specimenId}</a>
          </h3>
          <CustodyTimeline specimenId={specimenId} />
        </section>
      ))}
    </main>
  );
}
