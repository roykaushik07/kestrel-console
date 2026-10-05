import CustodyTimeline from "@/components/CustodyTimeline";

export default async function SpecimenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main style={{ padding: 24 }}>
      <h1>Specimen {id}</h1>
      <CustodyTimeline specimenId={id} />
    </main>
  );
}
