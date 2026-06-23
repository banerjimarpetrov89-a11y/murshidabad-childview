import { BLOCKS, DISTRICT_TOTALS, CLUSTERS } from "@/data/blocks";

export function buildDashboardContext() {
  const ranked = [...BLOCKS].sort((a, b) => b.reportingSilence - a.reportingSilence);
  const rows = BLOCKS.map((b) => ({
    block: b.name,
    cluster: CLUSTERS[b.cluster].label,
    risk: b.risk,
    teenPregnancies: b.pregnancies,
    childMarriages: b.childMarriages,
    k1Dropouts: b.k1Dropouts,
    firs: b.firs,
    reportingSilence: b.reportingSilence,
    policeStation: b.policeStation,
  }));
  return {
    district: "West Bengal",
    totals: DISTRICT_TOTALS,
    criticalBlocks: ranked.filter((b) => b.risk === "critical").map((b) => b.name),
    highBlocks: ranked.filter((b) => b.risk === "high").map((b) => b.name),
    clusters: Object.entries(CLUSTERS).map(([id, c]) => ({ id, ...c })),
    blocks: rows,
  };
}
