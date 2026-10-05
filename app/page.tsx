import DroneMap from "@/components/DroneMap";
import MissionBoard from "@/components/MissionBoard";

export default function Home() {
  return (
    <main style={{ display: "grid", gridTemplateColumns: "1fr 420px", height: "100vh" }}>
      <DroneMap />
      <MissionBoard />
    </main>
  );
}
