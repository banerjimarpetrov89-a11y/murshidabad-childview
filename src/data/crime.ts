// Crime data extracted from "Crime Against Children — Murshidabad" 2nd draft (May–Nov 2025).
// Sources: eCourts Murshidabad, Daily Arrest Report (DAR), CMRTS portal, NFHS-V vs NFHS-IV.

export type PSCaseRow = {
  ps: string;
  total: number;
  pocsoChildMarriage: number;
  pocsoRape: number;
  pocsoKidnapping: number;
  sexualAssault: number;
  sexualHarassment: number;
  others: number;
};

// 14 police stations covered in the draft. Numbers are 2025 (full-year filings tracked).
export const POLICE_STATION_CASES: PSCaseRow[] = [
  { ps: "Lalgola",       total: 65, pocsoChildMarriage: 13, pocsoRape: 12, pocsoKidnapping: 19, sexualAssault: 11, sexualHarassment: 6, others: 4 },
  { ps: "Murshidabad",   total: 51, pocsoChildMarriage: 9,  pocsoRape: 10, pocsoKidnapping: 14, sexualAssault: 10, sexualHarassment: 5, others: 3 },
  { ps: "Berhampore",    total: 62, pocsoChildMarriage: 8,  pocsoRape: 11, pocsoKidnapping: 17, sexualAssault: 13, sexualHarassment: 8, others: 5 },
  { ps: "Shamserganj",   total: 26, pocsoChildMarriage: 4,  pocsoRape: 5,  pocsoKidnapping: 7,  sexualAssault: 5,  sexualHarassment: 3, others: 2 },
  { ps: "Kandi",         total: 28, pocsoChildMarriage: 5,  pocsoRape: 6,  pocsoKidnapping: 8,  sexualAssault: 5,  sexualHarassment: 2, others: 2 },
  { ps: "Farakka",       total: 22, pocsoChildMarriage: 3,  pocsoRape: 4,  pocsoKidnapping: 6,  sexualAssault: 5,  sexualHarassment: 2, others: 2 },
  { ps: "Bhagwangola",   total: 43, pocsoChildMarriage: 7,  pocsoRape: 8,  pocsoKidnapping: 12, sexualAssault: 9,  sexualHarassment: 4, others: 3 },
  { ps: "Sagardighi",    total: 10, pocsoChildMarriage: 2,  pocsoRape: 1,  pocsoKidnapping: 3,  sexualAssault: 2,  sexualHarassment: 1, others: 1 },
  { ps: "Nabagram",      total: 18, pocsoChildMarriage: 3,  pocsoRape: 3,  pocsoKidnapping: 5,  sexualAssault: 4,  sexualHarassment: 2, others: 1 },
  { ps: "Khargram",      total: 13, pocsoChildMarriage: 2,  pocsoRape: 2,  pocsoKidnapping: 4,  sexualAssault: 3,  sexualHarassment: 1, others: 1 },
  { ps: "Burwan",        total: 15, pocsoChildMarriage: 2,  pocsoRape: 3,  pocsoKidnapping: 4,  sexualAssault: 3,  sexualHarassment: 2, others: 1 },
  { ps: "Bharatpur",     total: 33, pocsoChildMarriage: 5,  pocsoRape: 7,  pocsoKidnapping: 9,  sexualAssault: 7,  sexualHarassment: 3, others: 2 },
  { ps: "Suti",          total: 14, pocsoChildMarriage: 2,  pocsoRape: 3,  pocsoKidnapping: 4,  sexualAssault: 3,  sexualHarassment: 1, others: 1 },
  { ps: "Raghunathganj", total: 15, pocsoChildMarriage: 2,  pocsoRape: 3,  pocsoKidnapping: 4,  sexualAssault: 3,  sexualHarassment: 2, others: 1 },
];

export const PS_FREQUENCY_2024 = [
  { ps: "Lalgola", count: 31 },
  { ps: "Murshidabad", count: 19 },
  { ps: "Berhampore", count: 24 },
  { ps: "Shamserganj", count: 14 },
  { ps: "Kandi", count: 12 },
  { ps: "Farakka", count: 11 },
  { ps: "Bhagwangola", count: 18 },
];

export const PS_FREQUENCY_2025 = [
  { ps: "Lalgola", count: 38 },
  { ps: "Murshidabad", count: 23 },
  { ps: "Berhampore", count: 28 },
  { ps: "Shamserganj", count: 18 },
  { ps: "Kandi", count: 15 },
  { ps: "Farakka", count: 14 },
  { ps: "Bhagwangola", count: 21 },
];

// eCourts year-on-year category split
export const ECOURTS_YEAR_COMPARISON = [
  { category: "POCSO + Child Marriage", y2024: 15, y2025: 44 },
  { category: "POCSO + Kidnapping",     y2024: 67, y2025: 67 },
  { category: "Sexual Harassment",      y2024: 23, y2025: 43 },
  { category: "Sexual Assault",         y2024: 53, y2025: 102 },
  { category: "Other Child Crimes",     y2024: 43, y2025: 30 },
];

export const ECOURTS_TOTALS = { y2024: 201, y2025: 226, growth: 12.4 };

export const CMRTS_TREND = [
  { year: "2023", value: 130 },
  { year: "2024", value: 471 },
  { year: "2025", value: 929 },
];

export const NFHS_TREND = {
  childMarriage: { nfhs4: 53.6, nfhs5: 55.3, delta: +1.7 },
  teenagePregnancy: { nfhs4: 29.5, nfhs5: 20.6, delta: -8.9 },
};

export const DAR_SUMMARY = {
  murshidabadPD: {
    label: "Murshidabad Police District",
    total: 208,
    pcma: 97,
    pocso: 104,
    kidnapping: 20,
    trafficking: 17,
    multiConvict: 50,
    childConvicts: 18,
    avgAge: 28.5,
  },
  jangipurPD: {
    label: "Jangipur Police District",
    total: 25,
    pcma: 8,
    pocso: 17,
    rape: 3,
    multiConvict: 6,
    childConvicts: 9,
    avgAge: 26,
  },
  windowLabel: "May – Nov 2025",
};

export const LANDMARK_VERDICT = {
  title: "Landmark POCSO Verdict — 9-year-old victim",
  body: "In 2025 a Murshidabad fast-track POCSO court awarded the death sentence and life imprisonment to convict Dinabandhu Halder under POCSO §6 for the rape of a 9-year-old girl. The verdict — delivered within months of the FIR — proves the system can deliver swift justice when cases reach court.",
  citation: "Murshidabad POCSO Court · 2025 · State vs Dinabandhu Halder",
};

export const JANGIPUR_PD_BLOCKS = [
  "Farakka", "Samserganj", "Suti I", "Suti II",
  "Raghunathganj I", "Raghunathganj II", "Sagardighi",
];

export const JANGIPUR_PD_META = {
  blocks: 7,
  areaKm2: 1054.5,
  population: 1_900_000,
  established: "1 Jan 2020",
  focus: "Border security · anti-trafficking · POCSO investigation",
};

export const LIMITATIONS = [
  "Berhampore court data partially missing for 2024 — totals likely undercount.",
  "FIR records not yet joined with CMRTS prevented-marriage register.",
  "Pendency / disposal time per case not analysed in this draft.",
  "Convict demographics rely on Daily Arrest Reports (May–Nov 2025 window).",
  "NFHS-V is sample-based; per-block estimates extrapolated.",
];

export const DATA_SOURCE_LINKS = [
  { label: "eCourts Murshidabad", href: "https://services.ecourts.gov.in/" },
  { label: "CMRTS Portal", href: "https://cmrts.in/" },
  { label: "HMIS (NHM)", href: "https://hmis.mohfw.gov.in/" },
  { label: "Daily Arrest Report — WB Police", href: "https://www.wbpolice.gov.in/" },
  { label: "NFHS-V Factsheet", href: "https://rchiips.org/nfhs/factsheet_NFHS-5.shtml" },
];
