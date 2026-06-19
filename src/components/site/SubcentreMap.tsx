import { useEffect, useRef, useState } from "react";
import type { SCRecord } from "@/data/hmis";
import { SC_HMIS } from "@/data/hmis";
import { SC_COORDS } from "@/data/sc-coords";

declare global {
  interface Window {
    google: any;
    __initSubcentreMap?: () => void;
  }
}

const BROWSER_KEY = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
const TRACKING_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;

let loaderPromise: Promise<void> | null = null;
function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.google?.maps) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    if (!BROWSER_KEY) {
      reject(new Error("Google Maps browser key missing"));
      return;
    }
    window.__initSubcentreMap = () => resolve();
    const s = document.createElement("script");
    const channel = TRACKING_ID ? `&channel=${TRACKING_ID}` : "";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${BROWSER_KEY}&loading=async&callback=__initSubcentreMap${channel}`;
    s.async = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return loaderPromise;
}

function riskColor(highRiskPct?: number): string {
  if (highRiskPct == null) return "#64748b";
  if (highRiskPct >= 65) return "#dc2626";
  if (highRiskPct >= 55) return "#ea580c";
  if (highRiskPct >= 45) return "#d97706";
  return "#059669";
}

type Props = {
  data?: SCRecord[];
  coords?: Record<string, [number, number]>;
  center?: [number, number];
  zoom?: number;
  blockLabel?: string;
  height?: number;
};

export default function SubcentreMap({
  data = SC_HMIS,
  coords = SC_COORDS,
  center = [24.7833, 87.9667],
  zoom = 12,
  blockLabel = "Samserganj",
  height = 520,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !mapRef.current || !window.google?.maps) return;
        const g = window.google.maps;
        const map = new g.Map(mapRef.current, {
          center: { lat: center[0], lng: center[1] },
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
        });
        const info = new g.InfoWindow();
        const bounds = new g.LatLngBounds();
        data.forEach((r) => {
          const c = coords[r.sc];
          if (!c) return;
          const pos = { lat: c[0], lng: c[1] };
          bounds.extend(pos);
          const color = riskColor(r.highRiskPct);
          const marker = new g.Marker({
            position: pos,
            map,
            title: r.sc,
            icon: {
              path: g.SymbolPath.CIRCLE,
              scale: 8 + Math.min(10, (r.newPW || 0) / 80),
              fillColor: color,
              fillOpacity: 0.85,
              strokeColor: "#0f172a",
              strokeWeight: 1.2,
            },
          });
          marker.addListener("click", () => {
            const teenPct = r.newPW ? ((r.pw15_19 / r.newPW) * 100).toFixed(1) : "—";
            info.setContent(`
              <div style="font-family:system-ui,sans-serif;min-width:220px">
                <div style="font-weight:600;font-size:14px;margin-bottom:6px;color:#0f172a">${r.sc}</div>
                <div style="font-size:11px;color:#64748b;margin-bottom:6px">${blockLabel}</div>
                <div style="font-size:12px;color:#334155;line-height:1.6">
                  <div><b>New PW tracked:</b> ${r.newPW}</div>
                  <div><b>Age 15–19 PW:</b> ${r.pw15_19} <span style="color:#64748b">(${teenPct}%)</span></div>
                  <div><b>1st-trimester ANC:</b> ${r.firstTri} <span style="color:#64748b">(${r.firstTriPct ?? "—"}%)</span></div>
                  <div><b>High-risk antenatal:</b> ${r.hrpAnte} <span style="color:#64748b">(${r.highRiskPct ?? "—"}%)</span></div>
                  <div><b>BCG immunised:</b> ${r.bcg}</div>
                  <div><b>Antara doses (1→4):</b> ${r.d1 ?? 0} → ${r.d2 ?? 0} → ${r.d3 ?? 0} → ${r.d4 ?? 0}</div>
                </div>
                <div style="font-size:10px;color:#94a3b8;margin-top:6px">Approximate location within ${blockLabel} block</div>
              </div>
            `);
            info.open({ anchor: marker, map });
          });
        });
        if (!bounds.isEmpty()) map.fitBounds(bounds, 40);
      })
      .catch((e) => setErr(e.message || "Failed to load map"));
    return () => {
      cancelled = true;
    };
  }, [data, coords, center, zoom, blockLabel]);

  if (!BROWSER_KEY) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground">
        Google Maps key not configured.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        ref={mapRef}
        className="w-full rounded-lg border bg-muted/20"
        style={{ height }}
        aria-label={`Sub-centre map of ${blockLabel} block`}
      />
      {err && <div className="text-xs text-destructive">{err}</div>}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full" style={{ background: "#059669" }} /> Low HRP (&lt;45%)</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full" style={{ background: "#d97706" }} /> 45–55%</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full" style={{ background: "#ea580c" }} /> 55–65%</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full" style={{ background: "#dc2626" }} /> ≥65% high-risk antenatal</span>
        <span className="ml-auto italic">Marker size ∝ pregnant women tracked. Positions approximate.</span>
      </div>
    </div>
  );
}
