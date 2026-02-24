import fs from "fs";
import path from "path";

const root = process.cwd();
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.mkdirSync(path.join(dist, "data/processed"), { recursive: true });

const copies = [
  ["src/index.html", "index.html"],
  ["src/styles.css", "styles.css"],
  ["src/app.js", "app.js"],
  ["data/processed/budget_2026.json", "data/processed/budget_2026.json"],
  ["sources.md", "sources.md"],
];

for (const [from, to] of copies) {
  fs.copyFileSync(path.join(root, from), path.join(dist, to));
}

console.log("Static site built in dist/");
