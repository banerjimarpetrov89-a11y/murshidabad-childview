// Year-wise mortality data parsed from district HMIS exports
// Source: District Health office — Infant Death by place of death (2025-26 upto Nov)
// and Maternal Death by block/municipality (2025-26 upto Dec 25)

export type FacilityDeath = { unit: string; deaths: number };

export const INFANT_DEATHS_2025_26: FacilityDeath[] = [
  { unit: "Murshidabad MCH", deaths: 643 },
  { unit: "Jangipur SDH", deaths: 182 },
  { unit: "Lalbagh SDH", deaths: 101 },
  { unit: "Domkol SDH", deaths: 96 },
  { unit: "Kandi SDH", deaths: 76 },
  { unit: "Berhampore", deaths: 13 },
  { unit: "Lalgola", deaths: 13 },
  { unit: "Suti-II", deaths: 13 },
  { unit: "Bharatpur-II", deaths: 12 },
  { unit: "Khargram", deaths: 9 },
  { unit: "Kandi (block)", deaths: 8 },
  { unit: "Farakka", deaths: 8 },
  { unit: "Samserganj", deaths: 8 },
  { unit: "Bharatpur-I", deaths: 7 },
  { unit: "Raghunathganj-I", deaths: 7 },
  { unit: "Raghunathganj-II", deaths: 7 },
  { unit: "Beldanga-I", deaths: 6 },
  { unit: "Bhagawangola-II", deaths: 6 },
  { unit: "Nabagram", deaths: 5 },
  { unit: "Jalangi", deaths: 5 },
  { unit: "Domkol (block)", deaths: 5 },
  { unit: "Raninagar-I", deaths: 5 },
  { unit: "Raninagar-II", deaths: 5 },
  { unit: "Burwan", deaths: 5 },
  { unit: "Sagardighi", deaths: 5 },
  { unit: "Hariharpara", deaths: 4 },
  { unit: "Beldanga-II", deaths: 3 },
  { unit: "Nowda", deaths: 2 },
  { unit: "Sagardighi SSH", deaths: 2 },
  { unit: "Msd-Jiaganj", deaths: 1 },
  { unit: "Beldanga R.H", deaths: 0 },
  { unit: "Bhagawangola-I", deaths: 0 },
  { unit: "Suti-I", deaths: 0 },
];

export const INFANT_DEATH_TOTAL = 1262;
export const INFANT_DEATH_PERIOD = "2025-26 · April → November";

export const MATERNAL_DEATHS_2025_26: FacilityDeath[] = [
  { unit: "Farakka", deaths: 7 },
  { unit: "Berhampore", deaths: 6 },
  { unit: "Raninagar-I", deaths: 6 },
  { unit: "Samserganj", deaths: 6 },
  { unit: "Suti-I", deaths: 6 },
  { unit: "Suti-II", deaths: 6 },
  { unit: "Lalgola", deaths: 5 },
  { unit: "Raghunathganj-I", deaths: 5 },
  { unit: "Burwan", deaths: 4 },
  { unit: "Sagardighi", deaths: 4 },
  { unit: "Msd-Jiaganj", deaths: 3 },
  { unit: "Raghunathganj-II", deaths: 3 },
  { unit: "Berhampore (M)", deaths: 2 },
  { unit: "Bhagawangola-I", deaths: 2 },
  { unit: "Kandi", deaths: 2 },
  { unit: "Nabagram", deaths: 2 },
  { unit: "Beldanga-II", deaths: 1 },
  { unit: "Domkal", deaths: 1 },
  { unit: "Dhuliyan (M)", deaths: 1 },
  { unit: "Hariharpara", deaths: 1 },
  { unit: "Jalangi", deaths: 1 },
  { unit: "Jangipur (M)", deaths: 1 },
  { unit: "Khargram", deaths: 1 },
  { unit: "Bharatpur-I", deaths: 0 },
  { unit: "Bharatpur-II", deaths: 0 },
  { unit: "Bhagawangola-II", deaths: 0 },
  { unit: "Nowda", deaths: 0 },
  { unit: "Raninagar-II", deaths: 0 },
];

export const MATERNAL_DEATH_DISTRICT_TOTAL = 86;
export const MATERNAL_DEATH_GRAND_TOTAL = 100; // incl. other district + Jharkhand referrals
export const MATERNAL_DEATH_PERIOD = "2025-26 · April → December";

// Additional block HMIS ingests now in the corpus (PW tracked from monthly HMIS workbooks)
export const NEW_BLOCK_HMIS = [
  { block: "Bhagwangola-I", period: "Jan 2026", scCount: 18, note: "Block HMIS — Jan 2026 monthly cumulative" },
  { block: "Karnasubarna BPHC", period: "Apr → Dec 2025", scCount: 12, note: "SC-wise HMIS · cumulative through Dec 25" },
  { block: "Nabagram", period: "FY 2024-25", scCount: 22, note: "Data-item-wise NHM HMIS export" },
  { block: "Sagardighi", period: "Apr 2025 → Jan 2026", scCount: 23, note: "10-month cumulative monthly export" },
] as const;
