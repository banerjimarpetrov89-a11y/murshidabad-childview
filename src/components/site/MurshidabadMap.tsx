import { useEffect, useRef, useState } from "react";
import { BLOCKS, riskColor, riskLabel, type Block } from "@/data/blocks";

type Props = {
  height?: number | string;
  onSelect?: (block: Block) => void;
  selectedId?: string | null;
  showLegend?: boolean;
  interactive?: boolean;
};

export function MurshidabadMap({
  height = 520,
  onSelect,
  selectedId = null,
  showLegend = true,
  interactive = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        const data = JSON.parse(geo);
        const blockMap = new Map(BLOCKS.map((b) => [b.id, b]));

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

        const styleFor = (id: string, isSel: boolean) => {
          const b = blockMap.get(id);
          const color = b ? riskColor(b.risk) : "#999";
          return {
            color: isSel ? "#0f172a" : "#ffffff",
            weight: isSel ? 3 : 1.2,
            fillColor: color,
            fillOpacity: isSel ? 0.92 : 0.78,
          };
        };

        const layer = L.geoJSON(data, {
          style: (feat: any) => styleFor(feat.properties.id, feat.properties.id === selectedId),
          onEachFeature: (feature: any, lyr: any) => {
            const b = blockMap.get(feature.properties.id);
            if (!b) return;
            lyr.bindTooltip(
              `<div style="font-family:Inter,sans-serif;min-width:180px">
                <div style="font-weight:700;font-size:13px;color:#0f172a">${b.name}</div>
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:${riskColor(b.risk)};font-weight:700;margin-top:2px">${riskLabel(b.risk)} risk</div>
                <div style="margin-top:6px;font-size:11px;color:#475569;line-height:1.5">
                  <div><b style="color:#0f172a">${b.pregnancies.toLocaleString("en-IN")}</b> teenage pregnancies</div>
                  <div><b style="color:#0f172a">${b.childMarriages}</b> child marriages · <b style="color:#0f172a">${b.firs}</b> FIRs</div>
                  <div><b style="color:#0f172a">${b.k1Dropouts}</b> K1 dropouts</div>
                </div>
              </div>`,
              { sticky: true, direction: "top", opacity: 1 }
            );
            lyr.on({
              mouseover: (e: any) => {
                e.target.setStyle({ weight: 2.5, fillOpacity: 0.95 });
                e.target.bringToFront();
              },
              mouseout: (e: any) => {
                e.target.setStyle(styleFor(feature.properties.id, feature.properties.id === selectedId));
              },
              click: () => {
                if (onSelect) onSelect(b);
              },
            });
          },
        }).addTo(map);
        layerRef.current = layer;

        map.fitBounds(layer.getBounds(), { padding: [10, 10] });
        setReady(true);
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

  // Restyle on selection change
  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.eachLayer((lyr: any) => {
      const id = lyr.feature?.properties?.id;
      const b = BLOCKS.find((x) => x.id === id);
      if (!b) return;
      const isSel = id === selectedId;
      lyr.setStyle({
        color: isSel ? "#0f172a" : "#ffffff",
        weight: isSel ? 3 : 1.2,
        fillColor: riskColor(b.risk),
        fillOpacity: isSel ? 0.92 : 0.78,
      });
    });
  }, [selectedId]);

  return (
    <div className="relative">
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
            Boundaries: Census 2011 sub-districts (LGD)
          </span>
        </div>
      )}
    </div>
  );
}
