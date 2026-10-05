"use client";

import { useEffect, useState } from "react";
import type { TelemetryFrame } from "@kestrel/contracts";

/** Latest frame per drone, fed by the SSE relay. */
export function useTelemetry() {
  const [frames, setFrames] = useState<Record<string, TelemetryFrame>>({});

  useEffect(() => {
    const source = new EventSource("/api/stream");
    source.onmessage = (e) => {
      const frame = JSON.parse(e.data) as TelemetryFrame;
      setFrames((prev) => ({ ...prev, [frame.droneId]: frame }));
    };
    return () => source.close();
  }, []);

  return frames;
}
