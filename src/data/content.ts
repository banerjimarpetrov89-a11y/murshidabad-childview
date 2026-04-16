// Editorial content (red flags, action plan, default seed for sections without DB rows)

export const RED_FLAGS = [
  {
    id: "domkol-justice-gap",
    title: "Domkol: 4,393 pregnancies, 0 FIRs",
    severity: "critical",
    body: "Domkol block reports 4,393 cumulative teenage pregnancies and zero registered POCSO or child-marriage FIRs. The justice system is structurally absent for the most vulnerable children in this block.",
    action:
      "Open a permanent CWC sub-desk in Domkol; mandate ASHA-to-police bridge protocol; audit every teenage pregnancy registered in HMIS against marriage and POCSO statutes.",
  },
  {
    id: "raninagar-bride-truth",
    title: "Raninagar II: 125 of 157 K1 dropouts were child brides",
    severity: "critical",
    body: "Field verification of 157 Kanyashree K1 non-renewals in Raninagar II found that 125 (≈80%) were already married off before age 18. The scheme records list them as 'dropouts' — masking a child-marriage epidemic.",
    action:
      "Treat every K1 non-renewal as a presumed child-marriage case until home visit clears it. Link DPMU dropout list to CMRTS in real time.",
  },
  {
    id: "beldanga-2-leak",
    title: "Beldanga II: 60% of 470 K1 dropouts = underage marriage",
    severity: "critical",
    body: "DPMU + CINI sample audit estimates ~282 of 470 Kanyashree dropouts in Beldanga II were married underage. Local CMRTS records only 96 cases — a 3x reporting gap.",
    action: "Cross-verify all 470 cases via panchayat register; activate village-level child protection committees in Mirzapur and Bhabta.",
  },
  {
    id: "kanyashree-loophole",
    title: "The Kanyashree Loophole",
    severity: "high",
    body: "Kanyashree K2 (₹25,000 lump-sum at 18) creates a perverse incentive: families wait until the girl turns 18 on paper, marry her shortly after the payout — but in many cases the marriage has already happened years earlier and is concealed until the cheque clears.",
    action: "Tie K2 disbursal to school-continuation proof; make panchayat-level marriage register mandatory before payout.",
  },
  {
    id: "justice-gap",
    title: "District Justice Gap: 86,928 → 427",
    severity: "critical",
    body: "From 86,928 teenage pregnancies recorded in HMIS to only 427 FIRs filed, the system loses 99.5% of cases between health detection and legal action. Every drop-off is a child without protection.",
    action: "Single-window child protection MIS linking HMIS, DPMU, CMRTS and eCourts. Mandatory 30-day status update on every flagged child.",
  },
];

export const ACTION_PLAN = {
  partA: {
    title: "Part A — Data & Tracking",
    icon: "📊",
    items: [
      { title: "Unified Child Protection MIS", body: "Link HMIS (health), DPMU (Kanyashree), CMRTS (marriage register) and eCourts in a single dashboard for every block-level officer." },
      { title: "Real-time K1 dropout audit", body: "Every Kanyashree non-renewal triggers a 14-day home visit by ASHA + ICDS worker, logged with photo and panchayat sign-off." },
      { title: "HMIS-to-CMRTS bridge", body: "Every teenage pregnancy auto-flagged to the local CMRTS desk for marital status verification." },
      { title: "Quarterly block scorecard", body: "Public block-level scorecard published every quarter with discrepancy flags." },
    ],
  },
  partB: {
    title: "Part B — Community & Law Enforcement",
    icon: "🛡️",
    items: [
      { title: "Village Child Protection Committees", body: "Activate VCPCs in all 254 GPs; CINI to train and mentor for 18 months." },
      { title: "ASHA-to-Police bridge protocol", body: "ASHAs empowered (and protected) to report suspected child marriages directly to OC, with district-level escalation channel." },
      { title: "Panchayat marriage register", body: "Mandatory pre-marriage age verification at panchayat with biometric proof, before any social ceremony." },
      { title: "School re-entry guarantee", body: "Bridge schools + transport stipends for every rescued child bride; coordinated with SSA." },
    ],
  },
};

export const SEED_RESOURCES = [
  { title: "Integrated Child Protection Scheme (ICPS)", description: "Centrally sponsored scheme for child protection structures across India.", category: "scheme", stakeholder: "govt", theme: "protection", url: "https://wcd.gov.in/" },
  { title: "Kanyashree Prakalpa", description: "West Bengal's flagship cash-transfer scheme for adolescent girls.", category: "scheme", stakeholder: "govt", theme: "child_marriage", url: "https://wbkanyashree.gov.in/" },
  { title: "Beti Bachao Beti Padhao", description: "National campaign to address declining child sex ratio and women empowerment.", category: "scheme", stakeholder: "govt", theme: "protection", url: "https://wcd.nic.in/bbbp-schemes" },
  { title: "POCSO Act 2012 — Practitioner SOP", description: "Standard operating procedure for first responders under POCSO.", category: "sop", stakeholder: "govt", theme: "protection" },
  { title: "Child Marriage Restraint Officer Manual", description: "Field manual for CMROs at block level.", category: "manual", stakeholder: "govt", theme: "child_marriage" },
  { title: "CINI Frontline Worker Toolkit", description: "Training modules for ASHA, ICDS and panchayat-level workers on child protection.", category: "manual", stakeholder: "ngo", theme: "protection" },
  { title: "Anti-Trafficking SOP — West Bengal Police", description: "Cross-border trafficking response protocol.", category: "sop", stakeholder: "govt", theme: "trafficking" },
];

export const SEED_PUBLICATIONS = [
  { title: "Murshidabad Child Protection Baseline 2023", summary: "District-level baseline assessment across 26 blocks.", key_findings: "1 in 4 girls married before 18; 86,928 cumulative teenage pregnancies; only 0.5% of cases reach FIR.", year: 2023, type: "baseline" },
  { title: "Kanyashree Dropout Verification Study — Raninagar II", summary: "Field verification of 157 K1 non-renewals.", key_findings: "80% of dropouts were already child brides; scheme data structurally undercounts marriage.", year: 2024, type: "study" },
  { title: "District Action Plan 2025-26", summary: "Two-part action plan for the Murshidabad District Administration.", key_findings: "Unified MIS + VCPC activation in all 254 GPs.", year: 2025, type: "report" },
];

export const SEED_EVENTS = [
  { title: "District-wide Anti-Child-Marriage Drive", description: "Coordinated drive across 254 GPs led by DM with CINI support.", event_date: "2025-04-14", location: "Murshidabad District", type: "drive", impact_story: "118 underage marriages prevented in 30 days." },
  { title: "Kanyashree Tracking Workshop", description: "Block-level workshop on real-time K1 dropout audit.", event_date: "2025-06-10", location: "Berhampore", type: "campaign", impact_story: "All 26 BDOs trained; pilot launched in 5 high-risk blocks." },
  { title: "VCPC Activation — Border Belt", description: "Activation of Village Child Protection Committees in Lalgola, Bhagwangola I/II.", event_date: "2025-09-22", location: "North Border Cluster", type: "intervention", impact_story: "42 GPs reactivated their dormant VCPCs." },
];

export const SEED_STAKEHOLDERS = [
  { name: "District Magistrate, Murshidabad", type: "govt", role: "Convenor — District Child Protection Committee", areas: "All 26 blocks" },
  { name: "DPMU Kanyashree Cell", type: "govt", role: "Scheme administration & dropout audit", areas: "District-wide" },
  { name: "CINI (Child In Need Institute)", type: "ngo", role: "Frontline mentoring, VCPC activation, dropout verification", areas: "26 blocks; intensive in 7 high-risk" },
  { name: "ICDS Murshidabad", type: "govt", role: "AWW network & adolescent identification", areas: "All blocks" },
  { name: "WB Police — AHTU", type: "govt", role: "Anti-trafficking, POCSO investigation", areas: "Border belt + central hub" },
  { name: "UNICEF India", type: "csr", role: "Technical support & MIS design", areas: "District-wide" },
];

export const DATA_SOURCES = ["HMIS (Health)", "DPMU – Kanyashree", "CMRTS Marriage Register", "eCourts (POCSO + IPC)", "CINI Field Audits"];
