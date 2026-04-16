import { useEffect, useMemo, useRef, useState } from "react";
import { BLOCKS, COMPASS_LABELS, riskColor, riskLabel, type Block, type Compass } from "@/data/blocks";

export type MapIndicator = "risk" | "pregnancies" | "childMarriages" | "firs" | "reportingSilence";

type Props = {
  height?: number | string;
  onSelect?: (block: Block) => void;
  selectedId?: string | null;
  showLegend?: boolean;
  interactive?: boolean;
  showFilters?: boolean;
};

const INDICATOR_LABELS: Record<MapIndicator, string> = {
  risk: "Composite Risk",
  pregnancies: "Teenage Pregnancies",
  childMarriages: "Child Marriages (CMRTS)",
  firs: "FIRs Filed",
  reportingSilence: "Reporting Silence",
};

function shadeFor(b: Block, indicator: MapIndicator): string {
  if (indicator === "risk") return riskColor(b.risk);
  // metric → 5-bin scale → risk color
  const buckets: Record<Exclude<MapIndicator, "risk">, [number, number, number, number]> = {
    pregnancies: [2000, 3000, 3500, 4500],
    childMarriages: [25, 50, 75, 100],
    firs: [10, 20, 35, 55], // inverted: more FIRs = greener
    reportingSilence: [80, 90, 95, 98],
  };
  const v = b[indicator] as number;
  const [a, b2, c, d] = buckets[indicator];
  if (indicator === "firs") {
    if (v >= d) return "var(--risk-safe)";
    if (v >= c) return "var(--risk-low)";
    if (v >= b2) return "var(--risk-moderate)";
    if (v >= a) return "var(--risk-high)";
    return "var(--risk-critical)";
  }
  if (v >= d) return "var(--risk-critical)";
  if (v >= c) return "var(--risk-high)";
  if (v >= b2) return "var(--risk-moderate)";
  if (v >= a) return "var(--risk-low)";
  return "var(--risk-safe)";
}

export function MurshidabadMap({
  height = 520,
  onSelect,
  selectedId = null,
  showLegend = true,
  interactive = true,
  showFilters = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [compass, setCompass] = useState<Compass | "ALL">("ALL");
  const [indicator, setIndicator] = useState<MapIndicator>("risk");

  const blockMap = useMemo(() => new Map(BLOCKS.map((b) => [b.id, b])), []);

  // Init map (browser only)
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        const L = (await import("leaflet")).default;
        await import("leaflet/dist/leaflet.css");
        const geo = (await import("@/data/murshidabad-blocks.geojson?raw")).default;
        if (cancelled || !containerRef.current) return;

        LRef.current = L;
        const data = JSON.parse(geo);

        const map = L.map(containerRef.current, {
          zoomControl: interactive,
          dragging: interactive,
          scrollWheelZoom: false,
          doubleClickZoom: interactive,
          boxZoom: interactive,
          keyboard: interactive,
          touchZoom: interactive,
          attributionControl: false,
        });
        mapRef.current = map;

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
          subdomains: "abcd",
          maxZoom: 18,
          opacity: 0.5,
        }).addTo(map);

        const layer = L.geoJSON(data, {
          style: () => ({ color: "#ffffff", weight: 1.2, fillOpacity: 0.78 }),
          onEachFeature: (feature: any, lyr: any) => {
            const b = blockMap.get(feature.properties.id);
            if (!b) return;
            lyr.bindTooltip(
              `<div style="font-family:Inter,sans-serif;min-width:200px">
                <div style="font-weight:700;font-size:13px;color:#0f172a">${b.name}</div>
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:${riskColor(b.risk)};font-weight:700;margin-top:2px">${riskLabel(b.risk)} risk · ${COMPASS_LABELS[b.compass]}</div>
                <div style="margin-top:6px;font-size:11px;color:#475569;line-height:1.5">
                  <div><b style="color:#0f172a">${b.pregnancies.toLocaleString("en-IN")}</b> teenage pregnancies</div>
                  <div><b style="color:#0f172a">${b.childMarriages}</b> CMRTS · <b style="color:#0f172a">${b.firs}</b> FIRs</div>
                  ${b.policeStation ? `<div style="margin-top:2px;color:#64748b">PS: ${b.policeStation}</div>` : ""}
                </div>
              </div>`,
              { sticky: true, direction: "top", opacity: 1 }
            );
            lyr.on({
              mouseover: (e: any) => {
                e.target.setStyle({ weight: 2.5 });
                e.target.bringToFront();
              },
              mouseout: () => restyle(),
              click: () => {
                if (onSelect) onSelect(b);
              },
            });
          },
        }).addTo(map);
        layerRef.current = layer;

        map.fitBounds(layer.getBounds(), { padding: [10, 10] });
        setReady(true);
        restyle();
      } catch (e: any) {
        console.error("Map init failed", e);
        setError(e?.message ?? "Failed to load map");
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restyle = () => {
    if (!layerRef.current) return;
    const L = LRef.current;
    let activeBounds: any = null;
    layerRef.current.eachLayer((lyr: any) => {
      const id = lyr.feature?.properties?.id;
      const b = blockMap.get(id);
      if (!b) return;
      const isSel = id === selectedId;
      const inFilter = compass === "ALL" || b.compass === compass;
      lyr.setStyle({
        color: isSel ? "#0f172a" : "#ffffff",
        weight: isSel ? 3 : 1.2,
        fillColor: shadeFor(b, indicator),
        fillOpacity: inFilter ? (isSel ? 0.92 : 0.8) : 0.12,
      });
      if (inFilter && L) {
        activeBounds = activeBounds ? activeBounds.extend(lyr.getBounds()) : L.latLngBounds(lyr.getBounds().getSouthWest(), lyr.getBounds().getNorthEast());
      }
    });
    if (activeBounds && mapRef.current && compass !== "ALL") {
      mapRef.current.fitBounds(activeBounds, { padding: [10, 10] });
    } else if (compass === "ALL" && mapRef.current && layerRef.current) {
      mapRef.current.fitBounds(layerRef.current.getBounds(), { padding: [10, 10] });
    }
  };

  useEffect(() => {
    if (ready) restyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, compass, indicator, ready]);

  return (
    <div className="relative">
      {showFilters && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 rounded-md border border-border bg-secondary/40 p-1">
            {(["ALL", "N", "S", "E", "W", "C"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCompass(c)}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                  compass === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c === "ALL" ? "All" : COMPASS_LABELS[c]}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <label className="text-muted-foreground">Shade by:</label>
            <select
              value={indicator}
              onChange={(e) => setIndicator(e.target.value as MapIndicator)}
              className="rounded-md border border-border bg-card px-2 py-1 text-xs"
            >
              {(Object.keys(INDICATOR_LABELS) as MapIndicator[]).map((k) => (
                <option key={k} value={k}>{INDICATOR_LABELS[k]}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        style={{ height, width: "100%" }}
        className="rounded-lg overflow-hidden bg-secondary/40"
        aria-label="Murshidabad block map"
        role="img"
      />
      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          Loading map…
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-destructive">
          {error}
        </div>
      )}
      {showLegend && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          {(["critical", "high", "moderate", "low", "safe"] as const).map((r) => (
            <div key={r} className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: riskColor(r) }} />
              <span className="text-muted-foreground">{riskLabel(r)}</span>
            </div>
          ))}
          <span className="ml-auto text-[10px] text-muted-foreground">
            {INDICATOR_LABELS[indicator]} · Boundaries: Census 2011 sub-districts (LGD)
          </span>
        </div>
      )}
    </div>
  );
}
