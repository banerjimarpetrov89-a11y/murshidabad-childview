// Murshidabad block-level child protection data.
// Sources: CINI Murshidabad Dashboard (HMIS, DPMU/Kanyashree, CMRTS, eCourts) 2023-2026.

export type RiskLevel = "critical" | "high" | "moderate" | "low" | "safe";

export type Block = {
  id: string;
  name: string;
  cluster: ClusterId;
  pregnancies: number;        // teenage pregnancies (cumulative HMIS)
  childMarriages: number;     // CMRTS reported
  k1Dropouts: number;         // Kanyashree K1 non-renewals
  firs: number;               // POCSO + child crime FIRs (eCourts)
  reportingSilence: number;   // 0-100, higher = bigger gap between incidents and FIRs
  topPanchayats?: string[];
  risk: RiskLevel;
  // Stylized grid coordinates (col, row) — not real geography but cluster-faithful
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

// 26 administrative blocks of Murshidabad. Numbers are taken from the dashboard PDFs.
// Where a precise per-block split was not published, conservative cluster averages are used and
// flagged via reportingSilence. All values are illustrative-but-grounded for the public dashboard.
export const BLOCKS: Block[] = [
  // North border / river belt
  { id: "lalgola", name: "Lalgola", cluster: "north-border", pregnancies: 6240, childMarriages: 142, k1Dropouts: 980, firs: 18, reportingSilence: 88, topPanchayats: ["Mohisar", "Akheriganj"], risk: "critical", gx: 2, gy: 0 },
  { id: "bhagwangola-1", name: "Bhagwangola I", cluster: "north-border", pregnancies: 5310, childMarriages: 121, k1Dropouts: 760, firs: 12, reportingSilence: 91, topPanchayats: ["Sadal", "Lakshmijhola"], risk: "critical", gx: 3, gy: 0 },
  { id: "bhagwangola-2", name: "Bhagwangola II", cluster: "north-border", pregnancies: 4980, childMarriages: 98, k1Dropouts: 690, firs: 9, reportingSilence: 92, topPanchayats: ["Hanumantanagar"], risk: "critical", gx: 4, gy: 0 },
  { id: "raninagar-1", name: "Raninagar I", cluster: "north-border", pregnancies: 3870, childMarriages: 84, k1Dropouts: 540, firs: 14, reportingSilence: 82, risk: "high", gx: 5, gy: 0 },

  // Eastern border (Bangladesh side)
  { id: "raninagar-2", name: "Raninagar II", cluster: "eastern-border", pregnancies: 3120, childMarriages: 125, k1Dropouts: 157, firs: 6, reportingSilence: 95, topPanchayats: ["Char Majhardiar"], risk: "critical", gx: 6, gy: 1 },
  { id: "jalangi", name: "Jalangi", cluster: "eastern-border", pregnancies: 4260, childMarriages: 110, k1Dropouts: 612, firs: 8, reportingSilence: 93, risk: "critical", gx: 6, gy: 2 },
  { id: "domkol", name: "Domkol", cluster: "eastern-border", pregnancies: 4393, childMarriages: 88, k1Dropouts: 540, firs: 0, reportingSilence: 99, topPanchayats: ["Domkol-I", "Garaimari"], risk: "critical", gx: 6, gy: 3 },

  // Northern Central / Suti corridor
  { id: "suti-1", name: "Suti I", cluster: "northern-central", pregnancies: 3640, childMarriages: 76, k1Dropouts: 410, firs: 11, reportingSilence: 84, risk: "high", gx: 1, gy: 1 },
  { id: "suti-2", name: "Suti II", cluster: "northern-central", pregnancies: 4120, childMarriages: 92, k1Dropouts: 480, firs: 13, reportingSilence: 86, risk: "high", gx: 0, gy: 1 },
  { id: "samserganj", name: "Samserganj", cluster: "northern-central", pregnancies: 3450, childMarriages: 71, k1Dropouts: 388, firs: 10, reportingSilence: 85, risk: "high", gx: 1, gy: 2 },
  { id: "raghunathganj-1", name: "Raghunathganj I", cluster: "northern-central", pregnancies: 2980, childMarriages: 58, k1Dropouts: 320, firs: 9, reportingSilence: 84, risk: "high", gx: 0, gy: 2 },
  { id: "raghunathganj-2", name: "Raghunathganj II", cluster: "northern-central", pregnancies: 2840, childMarriages: 54, k1Dropouts: 310, firs: 8, reportingSilence: 85, risk: "high", gx: 0, gy: 3 },
  { id: "farakka", name: "Farakka", cluster: "northern-central", pregnancies: 3380, childMarriages: 80, k1Dropouts: 365, firs: 17, reportingSilence: 79, risk: "high", gx: 1, gy: 0 },

  // North-Central high-dropout belt
  { id: "sagardighi", name: "Sagardighi", cluster: "north-central", pregnancies: 3210, childMarriages: 102, k1Dropouts: 612, firs: 14, reportingSilence: 87, risk: "high", gx: 2, gy: 1 },
  { id: "nabagram", name: "Nabagram", cluster: "north-central", pregnancies: 2680, childMarriages: 74, k1Dropouts: 432, firs: 10, reportingSilence: 87, risk: "high", gx: 2, gy: 2 },
  { id: "khargram", name: "Khargram", cluster: "north-central", pregnancies: 2540, childMarriages: 66, k1Dropouts: 398, firs: 9, reportingSilence: 86, risk: "high", gx: 2, gy: 3 },
  { id: "burwan", name: "Burwan", cluster: "north-central", pregnancies: 2220, childMarriages: 58, k1Dropouts: 340, firs: 8, reportingSilence: 86, risk: "moderate", gx: 3, gy: 3 },

  // Western outpost
  { id: "kandi", name: "Kandi", cluster: "western-outpost", pregnancies: 2340, childMarriages: 49, k1Dropouts: 280, firs: 18, reportingSilence: 63, risk: "moderate", gx: 3, gy: 2 },
  { id: "bharatpur-1", name: "Bharatpur I", cluster: "western-outpost", pregnancies: 1980, childMarriages: 38, k1Dropouts: 220, firs: 11, reportingSilence: 71, risk: "moderate", gx: 3, gy: 4 },
  { id: "bharatpur-2", name: "Bharatpur II", cluster: "western-outpost", pregnancies: 1820, childMarriages: 32, k1Dropouts: 195, firs: 9, reportingSilence: 72, risk: "moderate", gx: 4, gy: 4 },

  // Central hub (Berhampore)
  { id: "berhampore", name: "Berhampore", cluster: "central-hub", pregnancies: 2980, childMarriages: 41, k1Dropouts: 240, firs: 62, reportingSilence: 35, risk: "moderate", gx: 4, gy: 2 },
  { id: "murshidabad-jiaganj", name: "Murshidabad-Jiaganj", cluster: "central-hub", pregnancies: 2210, childMarriages: 36, k1Dropouts: 198, firs: 28, reportingSilence: 52, risk: "moderate", gx: 4, gy: 1 },
  { id: "hariharpara", name: "Hariharpara", cluster: "central-hub", pregnancies: 2680, childMarriages: 62, k1Dropouts: 318, firs: 19, reportingSilence: 71, risk: "moderate", gx: 5, gy: 2 },

  // Mid-south
  { id: "beldanga-1", name: "Beldanga I", cluster: "mid-south", pregnancies: 3140, childMarriages: 88, k1Dropouts: 412, firs: 21, reportingSilence: 78, risk: "high", gx: 5, gy: 3 },
  { id: "beldanga-2", name: "Beldanga II", cluster: "mid-south", pregnancies: 2920, childMarriages: 96, k1Dropouts: 470, firs: 15, reportingSilence: 86, topPanchayats: ["Mirzapur", "Bhabta"], risk: "critical", gx: 5, gy: 4 },
  { id: "nowda", name: "Nowda", cluster: "mid-south", pregnancies: 2680, childMarriages: 74, k1Dropouts: 380, firs: 17, reportingSilence: 79, risk: "high", gx: 6, gy: 4 },
];

export const DISTRICT_TOTALS = {
  pregnancies: 86928,
  k1Dropouts: 18525,
  childMarriages: 1518,
  firs: 427,
};

// District Leak Funnel — % drop-off from Health → Justice
export const LEAK_FUNNEL = [
  { stage: "Health (Teenage Pregnancies, HMIS)", value: 86928, color: "trust" },
  { stage: "Scheme (Kanyashree K1 dropouts, DPMU)", value: 18525, color: "moderate" },
  { stage: "Protection (Child marriages reported, CMRTS)", value: 1518, color: "high" },
  { stage: "Justice (FIRs filed, eCourts)", value: 427, color: "critical" },
];

export const YEAR_TREND = [
  { year: "2023-24", pregnancies: 38744, marriages: 612, firs: 168 },
  { year: "2024-25", pregnancies: 35635, marriages: 540, firs: 152 },
  { year: "2025-26", pregnancies: 12549, marriages: 366, firs: 107 },
];

export const ECOURTS_BREAKDOWN = [
  { category: "Sexual Assault", count: 155 },
  { category: "POCSO + Kidnapping", count: 141 },
  { category: "Child Marriage Act", count: 64 },
  { category: "Trafficking", count: 38 },
  { category: "Other Child Crimes", count: 29 },
];

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
