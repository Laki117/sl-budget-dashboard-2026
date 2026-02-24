const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

const routeToFile = (urlPath) => {
  if (urlPath === "/") return path.join(ROOT, "src/index.html");
  if (urlPath.startsWith("/data/")) return path.join(ROOT, urlPath);
  if (urlPath === "/styles.css") return path.join(ROOT, "src/styles.css");
  if (urlPath === "/app.js") return path.join(ROOT, "src/app.js");
  if (urlPath === "/sources.md") return path.join(ROOT, "sources.md");
  return null;
};

http
  .createServer((req, res) => {
    const safePath = (req.url || "/").split("?")[0];
    const filePath = routeToFile(safePath);

    if (!filePath) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Server error");
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(PORT, () => {
    console.log(`Dashboard running at http://localhost:${PORT}`);
  });
