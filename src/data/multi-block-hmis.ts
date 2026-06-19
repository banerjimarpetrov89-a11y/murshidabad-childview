// Scaffolded sub-centre HMIS for 7 Murshidabad blocks.
// VALUES & COORDINATES ARE PLACEHOLDER (deterministic seeded synth) pending
// official HMIS workbook uploads. Magnitudes are tuned to be plausible against
// the real Samserganj sample (180-680 new PW; 6-28% teen share; 30-75% high-risk
// share; Antara D1→D4 with the typical drop-off). Do NOT cite as field data.

import type { SCRecord } from "./hmis";

export type BlockPack = {
  block: string;
  fyLabel: string;
  centroid: [number, number];
  scs: SCRecord[];
  coords: Record<string, [number, number]>;
  note: string;
  scaffold: true;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildBlock(
  block: string,
  centroid: [number, number],
  scNames: string[],
  seed: number,
  fyLabel: string,
  note: string,
): BlockPack {
  const rand = mulberry32(seed);
  const coords: Record<string, [number, number]> = {};
  const scs: SCRecord[] = scNames.map((name) => {
    const dLat = (rand() - 0.5) * 0.14;
    const dLng = (rand() - 0.5) * 0.16;
    coords[name] = [+(centroid[0] + dLat).toFixed(4), +(centroid[1] + dLng).toFixed(4)];
    const newPW = Math.round(180 + rand() * 480);
    const teenPct = 6 + rand() * 22;
    const pw15_19 = Math.round((teenPct / 100) * newPW);
    const firstTriPct = Math.round(55 + rand() * 35);
    const firstTri = Math.round((firstTriPct / 100) * newPW);
    const highRiskPct = Math.round(30 + rand() * 45);
    const hrpAnte = Math.round((highRiskPct / 100) * newPW);
    const anaemicPct = +(rand() * 8).toFixed(1);
    const del15_19 = Math.round(pw15_19 * (0.3 + rand() * 0.4));
    const bcg = Math.round(newPW * (0.3 + rand() * 0.4));
    const d1 = Math.round(20 + rand() * 60);
    const d2 = Math.max(0, Math.round(d1 * (0.4 + rand() * 0.3)));
    const d3 = Math.max(0, Math.round(d2 * (0.4 + rand() * 0.3)));
    const d4 = Math.max(0, Math.round(d3 * (0.5 + rand() * 0.5)));
    return {
      sc: name, newPW, pw15_19, firstTri, del15_19, hrpAnte, bcg,
      d1, d2, d3, d4, firstTriPct, highRiskPct, anaemicPct,
    };
  });
  return { block, fyLabel, centroid, scs, coords, note, scaffold: true };
}

const SUTI_II_SCS = [
  "Aurangabad SC","Bahadurpur SC","Bansabati SC","Chhabghati SC","Daulatabad SC",
  "Harirampur SC","Jagtaj SC","Kashimnagar GP HQ SC","Lalitakuri SC","Mahishasthali SC",
  "Mithipur SC","Nimtita Suti SC","Panchgram SC","Ratanpur Suti SC","Sankopara SC",
  "Sekhalipur SC","Sripatpur SC","Tildanga SC","Umarpur RCH SC",
];

const MJ_SCS = [
  "Azimganj SC","Bahadurpur MJ SC","Bhabta SC","Brahmamayee SC","Char Madhupur SC",
  "Daharia SC","Dahapara SC","Daulatabad MJ SC","Gora Bazar SC","Hijuli SC",
  "Indrani SC","Jagat-Talab SC","Jiaganj GP HQ SC","Kahla SC","Kasimbazar SC",
  "Khagra RCH SC","Lalbagh SC","Mahisasthali MJ SC","Manindrapur SC","Pirojpur SC",
  "Saidapur SC","Sankarpur MJ SC",
];

const KHARGRAM_SCS = [
  "Aladipur SC","Balia Khargram SC","Bara SC","Bisrampur SC","Chandipur Khargram SC",
  "Dakshinpara SC","Eral SC","Ganguria SC","Hijal Khargram SC","Inderpur SC",
  "Jagannathpur SC","Khargram GP HQ SC","Khordauttar SC","Margram SC","Nagar SC",
  "Padmakanali SC","Parulia SC","Ratanpur Khargram SC","Salar SC","Sangram SC",
  "Tanua SC","Uchhalan SC",
];

const BHARATPUR_II_SCS = [
  "Alugram SC","Amlai SC","Belia SC","Bharatpur II HQ SC","Chandpara SC",
  "Daharia BP SC","Gobardanga SC","Hetampur SC","Indrabati SC","Jhilli SC",
  "Kankuria SC","Liluabari SC","Mongolkote SC","Nirol SC","Pancharra SC",
  "Sahebganj BP SC","Talgram SC","Uttarpara BP SC",
];

const BHAGWANGOLA_I_SCS = [
  "Akherigunj SC","Bhagwangola I HQ SC","Chandipur BG SC","Char Akherigunj SC",
  "Daulatabad BG SC","Hanumantanagar SC","Iswarpur SC","Jangipur Char SC","Kalukhali SC",
  "Lalpur BG SC","Madarpur SC","Nimtita BG SC","Pakuria BG SC","Ramnagar BG SC",
  "Sahebnagar SC","Subhasgram SC","Topkhana SC","Uttar Bhagwangola SC",
];

const NABAGRAM_SCS = [
  "Amaipara SC","Baruipur Nab SC","Chunakhali SC","Dakshinpara Nab SC","Domkal Char SC",
  "Gangarampur SC","Hatibhanga SC","Indrabarui SC","Jadupur SC","Kaijuri SC",
  "Lakshmipur Nab SC","Mahishpota SC","Nabagram GP HQ SC","Onkargunj SC","Pahari SC",
  "Rampara SC","Salika SC","Tarapur Nab SC",
];

const SAGARDIGHI_SCS = [
  "Bara Sagardighi SC","Bhotbari SC","Brahmani SC","Char Bagachra SC","Daudpur SC",
  "Govindapur Sag SC","Habibpur SC","Indrani Sag SC","Jagannathpur Sag SC","Karnasubarna SC",
  "Manigram SC","Monoharpur SC","Nirmalchar SC","Pakuria Sag SC","Pranabnagar SC",
  "Sagardighi GP HQ SC","Shankarpur Sag SC","Tarapur Sag SC","Uttarpara Sag SC","Varatpara SC",
];

export const MULTI_BLOCKS: BlockPack[] = [
  buildBlock("Suti II",        [24.6500, 88.0600], SUTI_II_SCS,        1001, "FY 2024-25 · scaffolded", "19 SCs — placeholder values pending HMIS upload."),
  buildBlock("Murshidabad-Jiaganj", [24.1800, 88.2700], MJ_SCS,         1002, "FY 2024-25 · scaffolded", "22 SCs — placeholder values pending HMIS upload."),
  buildBlock("Khargram",       [23.9500, 88.1000], KHARGRAM_SCS,       1003, "Apr-Aug 2025 · scaffolded", "22 SCs — placeholder values pending HMIS upload."),
  buildBlock("Bharatpur II",   [23.9200, 87.9300], BHARATPUR_II_SCS,   1004, "FY 2024-25 · scaffolded", "18 SCs — placeholder values pending HMIS upload."),
  buildBlock("Bhagwangola I",  [24.3000, 88.3200], BHAGWANGOLA_I_SCS,  1005, "FY 2024-25 · scaffolded", "18 SCs — placeholder values pending HMIS upload."),
  buildBlock("Nabagram",       [24.1300, 88.0500], NABAGRAM_SCS,       1006, "FY 2024-25 · scaffolded", "18 SCs — placeholder values pending HMIS upload."),
  buildBlock("Sagardighi",     [24.4500, 88.1000], SAGARDIGHI_SCS,     1007, "FY 2024-25 · scaffolded", "20 SCs — placeholder values pending HMIS upload."),
];

// District-wide teen pregnancy shortlist: top 3 SCs per block by 15-19 share.
export type TeenHotspot = { block: string; sc: string; pct: number; n: number; newPW: number };
export const TEEN_HOTSPOTS_DISTRICT: TeenHotspot[] = MULTI_BLOCKS.flatMap((b) =>
  b.scs
    .map((r) => ({ block: b.block, sc: r.sc, n: r.pw15_19, newPW: r.newPW, pct: r.newPW > 0 ? (r.pw15_19 / r.newPW) * 100 : 0 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3),
).sort((a, b) => b.pct - a.pct);
