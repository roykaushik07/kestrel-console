import type { ReactNode } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

export const metadata = { title: "Kestrel Ops Console" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
