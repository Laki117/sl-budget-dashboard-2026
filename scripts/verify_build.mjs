import fs from "fs";

const required = [
  "src/index.html",
  "src/styles.css",
  "src/app.js",
  "data/processed/budget_2026.json",
  "README.md",
  "DATA_DICTIONARY.md",
  "sources.md",
  "PROMPT_FOR_CODEX.md",
];

const missing = required.filter((p) => !fs.existsSync(p));
if (missing.length > 0) {
  console.error("Missing required files:\n" + missing.join("\n"));
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync("data/processed/budget_2026.json", "utf8"));
if (!Array.isArray(data.ministry_allocations) || data.ministry_allocations.length === 0) {
  console.error("Data validation failed: ministry_allocations is empty.");
  process.exit(1);
}

console.log("Build verification passed.");
