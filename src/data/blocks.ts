// Murshidabad block-level child protection data.
// Sources: CINI Murshidabad Dashboard (HMIS, DPMU/Kanyashree, CMRTS, eCourts) 2023-2026
// + "Crime Against Children — Murshidabad" 2nd draft (2025).

export type RiskLevel = "critical" | "high" | "moderate" | "low" | "safe";
export type Compass = "N" | "S" | "E" | "W" | "C";

export type Block = {
  id: string;
  name: string;
  cluster: ClusterId;
  compass: Compass;             // cardinal grouping for map filter
  policeStation?: string;       // primary jurisdictional PS
  pregnancies: number;          // teenage pregnancies (cumulative HMIS)
  childMarriages: number;       // CMRTS prevented / reported
  k1Dropouts: number;           // Kanyashree K1 non-renewals
  firs: number;                 // POCSO + child crime FIRs (eCourts)
  reportingSilence: number;     // 0-100, higher = bigger gap
  topPanchayats?: string[];
  risk: RiskLevel;
  gx: number;
  gy: number;
};

export type ClusterId =
  | "north-border"
  | "north-central"
  | "eastern-border"
  | "central-hub"
  | "western-outpost"
  | "mid-south"
  | "northern-central";

export const CLUSTERS: Record<ClusterId, { label: string; theme: string; description: string; color: RiskLevel }> = {
  "north-border": {
    label: "Border & River (North)",
    theme: "Cross-border vulnerability + river-island isolation",
    description:
      "Northern border blocks along the Padma. Trafficking corridors, low schooling continuity, high migration.",
    color: "critical",
  },
  "north-central": {
    label: "High Dropout Belt (North-Central)",
    theme: "Kanyashree leakage + child-marriage normalization",
    description:
      "Highest K1 non-renewal rates in the district. Dropouts strongly correlate with underage marriage.",
    color: "high",
  },
  "eastern-border": {
    label: "Eastern Border",
    theme: "Border smuggling + low FIR registration",
    description: "Bangladesh-border blocks with high incidence but very low formal complaint rates.",
    color: "critical",
  },
  "central-hub": {
    label: "Central Hub",
    theme: "Urban underreporting + court congestion",
    description: "Berhampore + neighbours. Higher reporting infrastructure but rising case load.",
    color: "moderate",
  },
  "western-outpost": {
    label: "Western Outpost",
    theme: "Agricultural distress + early marriage",
    description: "Western blocks with mid-level pregnancy rates and chronic dropouts.",
    color: "moderate",
  },
  "mid-south": {
    label: "Mid-South",
    theme: "Mixed industrial + rural pressure",
    description: "Beldanga, Hariharpara, Nowda corridor. Migration plus underage marriage clusters.",
    color: "high",
  },
  "northern-central": {
    label: "Northern Central",
    theme: "Transit zones",
    description: "Suti, Samserganj, Raghunathganj — labour migration and child-bride transit risk.",
    color: "high",
  },
};

// Per-block figures from "Crime Against Children — Murshidabad" 2nd draft.
// Reporting silence = 100 − (FIRs ÷ TP × 1000), clamped 0-100. Critical-quadrant blocks
// show 95+ silence (≤0.005 FIR/TP).
export const BLOCKS: Block[] = [
  // North border / river belt
  { id: "lalgola", name: "Lalgola", cluster: "north-border", compass: "N", policeStation: "Lalgola", pregnancies: 5445, childMarriages: 57, k1Dropouts: 980, firs: 65, reportingSilence: 88, topPanchayats: ["Mohisar", "Akheriganj"], risk: "critical", gx: 2, gy: 0 },
  { id: "bhagwangola-1", name: "Bhagwangola I", cluster: "north-border", compass: "N", policeStation: "Bhagwangola", pregnancies: 3483, childMarriages: 114, k1Dropouts: 760, firs: 18, reportingSilence: 95, topPanchayats: ["Sadal", "Lakshmijhola"], risk: "critical", gx: 3, gy: 0 },
  { id: "bhagwangola-2", name: "Bhagwangola II", cluster: "north-border", compass: "N", policeStation: "Bhagwangola", pregnancies: 2661, childMarriages: 71, k1Dropouts: 690, firs: 25, reportingSilence: 91, topPanchayats: ["Hanumantanagar"], risk: "critical", gx: 4, gy: 0 },
  { id: "raninagar-1", name: "Raninagar I", cluster: "north-border", compass: "N", policeStation: "Raninagar", pregnancies: 3165, childMarriages: 51, k1Dropouts: 540, firs: 25, reportingSilence: 92, risk: "high", gx: 5, gy: 0 },

  // Eastern border (Bangladesh side)
  { id: "raninagar-2", name: "Raninagar II", cluster: "eastern-border", compass: "E", policeStation: "Raninagar", pregnancies: 2990, childMarriages: 21, k1Dropouts: 157, firs: 25, reportingSilence: 92, topPanchayats: ["Char Majhardiar"], risk: "critical", gx: 6, gy: 1 },
  { id: "jalangi", name: "Jalangi", cluster: "eastern-border", compass: "N", policeStation: "Jalangi", pregnancies: 4260, childMarriages: 110, k1Dropouts: 612, firs: 8, reportingSilence: 98, risk: "critical", gx: 6, gy: 2 },
  { id: "domkol", name: "Domkol", cluster: "eastern-border", compass: "E", policeStation: "Domkol", pregnancies: 4393, childMarriages: 88, k1Dropouts: 540, firs: 0, reportingSilence: 100, topPanchayats: ["Domkol-I", "Garaimari"], risk: "critical", gx: 6, gy: 3 },

  // Northern Central / Suti corridor
  { id: "suti-1", name: "Suti I", cluster: "northern-central", compass: "N", policeStation: "Suti", pregnancies: 2909, childMarriages: 22, k1Dropouts: 410, firs: 14, reportingSilence: 95, risk: "high", gx: 1, gy: 1 },
  { id: "suti-2", name: "Suti II", cluster: "northern-central", compass: "N", policeStation: "Suti", pregnancies: 4120, childMarriages: 92, k1Dropouts: 480, firs: 13, reportingSilence: 97, risk: "high", gx: 0, gy: 1 },
  { id: "samserganj", name: "Samserganj", cluster: "northern-central", compass: "N", policeStation: "Shamserganj", pregnancies: 4548, childMarriages: 49, k1Dropouts: 388, firs: 26, reportingSilence: 94, risk: "high", gx: 1, gy: 2 },
  { id: "raghunathganj-1", name: "Raghunathganj I", cluster: "northern-central", compass: "N", policeStation: "Raghunathganj", pregnancies: 3601, childMarriages: 39, k1Dropouts: 320, firs: 8, reportingSilence: 98, risk: "high", gx: 0, gy: 2 },
  { id: "raghunathganj-2", name: "Raghunathganj II", cluster: "northern-central", compass: "N", policeStation: "Raghunathganj", pregnancies: 3600, childMarriages: 39, k1Dropouts: 310, firs: 7, reportingSilence: 98, risk: "high", gx: 0, gy: 3 },
  { id: "farakka", name: "Farakka", cluster: "northern-central", compass: "N", policeStation: "Farakka", pregnancies: 3361, childMarriages: 19, k1Dropouts: 365, firs: 22, reportingSilence: 93, risk: "high", gx: 1, gy: 0 },

  // North-Central high-dropout belt
  { id: "sagardighi", name: "Sagardighi", cluster: "north-central", compass: "N", policeStation: "Sagardighi", pregnancies: 4559, childMarriages: 32, k1Dropouts: 612, firs: 10, reportingSilence: 98, risk: "critical", gx: 2, gy: 1 },
  { id: "nabagram", name: "Nabagram", cluster: "north-central", compass: "W", policeStation: "Nabagram", pregnancies: 3040, childMarriages: 69, k1Dropouts: 432, firs: 18, reportingSilence: 94, risk: "high", gx: 2, gy: 2 },
  { id: "khargram", name: "Khargram", cluster: "north-central", compass: "S", policeStation: "Khargram", pregnancies: 3909, childMarriages: 39, k1Dropouts: 398, firs: 13, reportingSilence: 100, topPanchayats: ["Khargram", "Margram"], risk: "critical", gx: 2, gy: 3 },
  { id: "burwan", name: "Burwan", cluster: "north-central", compass: "S", policeStation: "Burwan", pregnancies: 2641, childMarriages: 20, k1Dropouts: 340, firs: 15, reportingSilence: 94, risk: "moderate", gx: 3, gy: 3 },

  // Western outpost
  { id: "kandi", name: "Kandi", cluster: "western-outpost", compass: "S", policeStation: "Kandi", pregnancies: 3522, childMarriages: 23, k1Dropouts: 280, firs: 28, reportingSilence: 92, risk: "moderate", gx: 3, gy: 2 },
  { id: "bharatpur-1", name: "Bharatpur I", cluster: "western-outpost", compass: "S", policeStation: "Bharatpur", pregnancies: 2112, childMarriages: 21, k1Dropouts: 220, firs: 20, reportingSilence: 91, risk: "moderate", gx: 3, gy: 4 },
  { id: "bharatpur-2", name: "Bharatpur II", cluster: "western-outpost", compass: "S", policeStation: "Bharatpur", pregnancies: 1734, childMarriages: 17, k1Dropouts: 195, firs: 13, reportingSilence: 93, risk: "moderate", gx: 4, gy: 4 },

  // Central hub (Berhampore)
  { id: "berhampore", name: "Berhampore", cluster: "central-hub", compass: "C", policeStation: "Berhampore", pregnancies: 2980, childMarriages: 41, k1Dropouts: 240, firs: 62, reportingSilence: 79, risk: "moderate", gx: 4, gy: 2 },
  { id: "murshidabad-jiaganj", name: "Murshidabad-Jiaganj", cluster: "central-hub", compass: "C", policeStation: "Murshidabad", pregnancies: 2760, childMarriages: 75, k1Dropouts: 198, firs: 51, reportingSilence: 81, risk: "moderate", gx: 4, gy: 1 },
  { id: "hariharpara", name: "Hariharpara", cluster: "central-hub", compass: "C", policeStation: "Hariharpara", pregnancies: 2680, childMarriages: 62, k1Dropouts: 318, firs: 19, reportingSilence: 93, risk: "moderate", gx: 5, gy: 2 },

  // Mid-south
  { id: "beldanga-1", name: "Beldanga I", cluster: "mid-south", compass: "C", policeStation: "Beldanga", pregnancies: 3140, childMarriages: 88, k1Dropouts: 412, firs: 21, reportingSilence: 93, risk: "high", gx: 5, gy: 3 },
  { id: "beldanga-2", name: "Beldanga II", cluster: "mid-south", compass: "C", policeStation: "Beldanga", pregnancies: 2920, childMarriages: 96, k1Dropouts: 470, firs: 15, reportingSilence: 95, topPanchayats: ["Mirzapur", "Bhabta"], risk: "critical", gx: 5, gy: 4 },
  { id: "nowda", name: "Nowda", cluster: "mid-south", compass: "C", policeStation: "Nowda", pregnancies: 2680, childMarriages: 74, k1Dropouts: 380, firs: 17, reportingSilence: 94, risk: "high", gx: 6, gy: 4 },
];

export const DISTRICT_TOTALS = {
  pregnancies: BLOCKS.reduce((s, b) => s + b.pregnancies, 0),
  k1Dropouts: BLOCKS.reduce((s, b) => s + b.k1Dropouts, 0),
  childMarriages: BLOCKS.reduce((s, b) => s + b.childMarriages, 0),
  firs: BLOCKS.reduce((s, b) => s + b.firs, 0),
};

export const LEAK_FUNNEL = [
  { stage: "Health (Teenage Pregnancies, HMIS)", value: DISTRICT_TOTALS.pregnancies, color: "trust" },
  { stage: "Scheme (Kanyashree K1 dropouts, DPMU)", value: DISTRICT_TOTALS.k1Dropouts, color: "moderate" },
  { stage: "Protection (CMRTS prevented marriages)", value: DISTRICT_TOTALS.childMarriages, color: "high" },
  { stage: "Justice (FIRs filed, eCourts)", value: DISTRICT_TOTALS.firs, color: "critical" },
];

export const YEAR_TREND = [
  { year: "2023-24", pregnancies: 38744, marriages: 130, firs: 168 },
  { year: "2024-25", pregnancies: 35635, marriages: 471, firs: 201 },
  { year: "2025-26", pregnancies: 12549, marriages: 929, firs: 226 },
];

export const ECOURTS_BREAKDOWN = [
  { category: "Sexual Assault", count: 155 },
  { category: "POCSO + Kidnapping", count: 134 },
  { category: "Sexual Harassment", count: 43 },
  { category: "POCSO + Child Marriage", count: 59 },
  { category: "Other Child Crimes", count: 36 },
];

// Cardinal cluster aggregates
export const COMPASS_LABELS: Record<Compass, string> = {
  N: "North", S: "South", E: "East", W: "West", C: "Central",
};

export function blocksByCompass(c: Compass) {
  return BLOCKS.filter((b) => b.compass === c);
}

export function compassRollup(c: Compass) {
  const list = blocksByCompass(c);
  const tp = list.reduce((s, b) => s + b.pregnancies, 0);
  const cm = list.reduce((s, b) => s + b.childMarriages, 0);
  const firs = list.reduce((s, b) => s + b.firs, 0);
  return { count: list.length, tp, cm, firs, ratio: tp ? (firs / tp) * 100 : 0 };
}

export function topRiskBlocks(n = 5): Block[] {
  return [...BLOCKS]
    .sort((a, b) => b.pregnancies + b.childMarriages * 50 - (a.pregnancies + a.childMarriages * 50))
    .slice(0, n);
}

export function blockBySlug(slug: string) {
  return BLOCKS.find((b) => b.id === slug);
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case "critical": return "var(--risk-critical)";
    case "high": return "var(--risk-high)";
    case "moderate": return "var(--risk-moderate)";
    case "low": return "var(--risk-low)";
    case "safe": return "var(--risk-safe)";
  }
}

export function riskLabel(level: RiskLevel): string {
  return { critical: "Critical", high: "High", moderate: "Moderate", low: "Low", safe: "Safe" }[level];
}
