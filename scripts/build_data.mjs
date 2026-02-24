import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const speechPath = path.join(ROOT, "data/raw/speech_key_lines_2026.txt");
const ministryPath = path.join(ROOT, "data/raw/ministry_allocations_2026_lkr_mn.csv");
const outPath = path.join(ROOT, "data/processed/budget_2026.json");

const speech = fs.readFileSync(speechPath, "utf8");
const csv = fs.readFileSync(ministryPath, "utf8").trim().split("\n");

const parseBn = (label, regex) => {
  const match = speech.match(regex);
  return {
    label,
    value_lkr_bn: match ? Number(match[1].replace(/,/g, "")) : null,
  };
};

const parsePct = (label, regex) => {
  const match = speech.match(regex);
  return {
    label,
    value_pct: match ? Number(match[1].replace(/,/g, "")) : null,
  };
};

const parseUsdBn = (label, regex) => {
  const match = speech.match(regex);
  return {
    label,
    value_usd_bn: match ? Number(match[1]) : null,
  };
};

const metrics = [
  parseBn("Total Expenditure", /Total expenditure.*?Rs\.\s*([\d,]+)\s*billion/i),
  parseBn("Recurrent Expenditure", /recurrent expenditure of Rs\.\s*([\d,]+)\s*billion/i),
  parseBn("Capital Expenditure", /capital expenditure of Rs\.\s*([\d,]+)\s*billion/i),
  parseBn("Total Revenue and Grants", /Total government revenue and grants.*?Rs\.\s*([\d,]+)\s*billion/i),
  parseBn("Tax Revenue", /tax revenue of Rs\.\s*([\d,]+)\s*billion/i),
  parseBn("Non-tax Revenue", /non-tax revenue of Rs\.\s*([\d,]+)\s*billion/i),
  parseBn("Overall Deficit", /overall budget deficit.*?Rs\.\s*([\d,]+)\s*billion/i),
  parseBn("Gross Financing Needs", /Gross financing needs.*?Rs\.\s*([\d,]+)\s*billion/i),
  parseBn("Debt Repayments", /debt repayments of Rs\.\s*([\d,]+)\s*billion/i),
  parsePct("Deficit to GDP", /equivalent to\s*([\d.]+)\s*percent of GDP/i),
  parsePct("Primary Surplus to GDP", /surplus at\s*([\d.]+)\s*percent of GDP/i),
  parsePct("Inflation Assumption", /target level of\s*([\d.]+)\s*percent/i),
  parsePct("GDP Growth Assumption", /GDP growth rate of\s*([\d.]+)\s*percent/i),
];

const taxPolicy = [
  {
    name: "Withholding tax on deposit interest",
    effective_date: "2026-04-01",
    previous_rate_pct: 5,
    new_rate_pct: 10,
  },
  {
    name: "Capital gains tax",
    effective_date: "2026-04-01",
    previous_rate_pct: 10,
    new_rate_pct: 15,
  },
];

const povertyMatch = speech.match(/from\s*([\d.]+)\s*percent in 2023 to\s*([\d.]+)\s*percent in 2025/i);
const exportsMatch = speech.match(/USD\s*([\d.]+)\s*billion in 2023 to USD\s*([\d.]+)\s*billion in 2024 and exceeded USD\s*([\d.]+)\s*billion in 2025/i);

const trends = {
  poverty_rate_pct: povertyMatch
    ? [
        { year: 2023, value: Number(povertyMatch[1]) },
        { year: 2025, value: Number(povertyMatch[2]) },
      ]
    : [],
  merchandise_exports_usd_bn: exportsMatch
    ? [
        { year: 2023, value: Number(exportsMatch[1]) },
        { year: 2024, value: Number(exportsMatch[2]) },
        { year: 2025, value: Number(exportsMatch[3]) },
      ]
    : [],
};

const parseCsvLine = (line) => {
  const out = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  out.push(current.trim());
  return out;
};

const rows = csv.slice(1).map(parseCsvLine).map((row) => ({
  ministry: row[0],
  recurrent_lkr_mn: Number(row[1]),
  capital_lkr_mn: Number(row[2]),
  total_lkr_mn: Number(row[3]),
}));

const topMinistries = [...rows].sort((a, b) => b.total_lkr_mn - a.total_lkr_mn);

const output = {
  metadata: {
    country: "Sri Lanka",
    fiscal_year: 2026,
    currency: "LKR",
    unit_conventions: {
      lkr_bn: "LKR billions",
      lkr_mn: "LKR millions",
      pct: "percent",
      usd_bn: "USD billions",
    },
    generated_at_utc: new Date().toISOString(),
    completeness_note:
      "Dataset is limited to figures explicitly available from currently retrieved official speech and activity estimate extracts. Missing figures are marked unavailable in UI.",
  },
  headline_metrics: metrics,
  ministry_allocations: rows,
  tax_policy_changes: taxPolicy,
  trend_indicators: trends,
  derived_insights: {
    top_5_ministry_share_pct_of_listed_allocations: (() => {
      const total = topMinistries.reduce((sum, item) => sum + item.total_lkr_mn, 0);
      const top5 = topMinistries.slice(0, 5).reduce((sum, item) => sum + item.total_lkr_mn, 0);
      return total > 0 ? Number(((top5 / total) * 100).toFixed(1)) : null;
    })(),
    capital_share_pct_of_listed_allocations: (() => {
      const capital = rows.reduce((sum, item) => sum + item.capital_lkr_mn, 0);
      const total = rows.reduce((sum, item) => sum + item.total_lkr_mn, 0);
      return total > 0 ? Number(((capital / total) * 100).toFixed(1)) : null;
    })(),
  },
};

fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Wrote ${outPath}`);
