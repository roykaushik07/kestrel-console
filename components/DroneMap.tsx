"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useTelemetry } from "@/lib/useTelemetry";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function DroneMap() {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef(new Map<string, mapboxgl.Marker>());
  const frames = useTelemetry();

  useEffect(() => {
    if (!container.current) return;
    map.current = new mapboxgl.Map({
      container: container.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-6.26, 53.35],
      zoom: 9,
    });
    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    if (!map.current) return;
    for (const frame of Object.values(frames)) {
      const lngLat: [number, number] = [frame.position.longitude, frame.position.latitude];
      let marker = markers.current.get(frame.droneId);
      if (!marker) {
        marker = new mapboxgl.Marker({ color: frame.batteryPercent < 20 ? "#e5484d" : "#3e9bff" })
          .setPopup(new mapboxgl.Popup().setText(frame.droneId))
          .setLngLat(lngLat)
          .addTo(map.current);
        markers.current.set(frame.droneId, marker);
      } else {
        marker.setLngLat(lngLat);
      }
    }
  }, [frames]);

  return <div ref={container} style={{ height: "100%" }} />;
}
