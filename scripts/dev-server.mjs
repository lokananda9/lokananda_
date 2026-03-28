import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const uploadsDirectory = path.join(root, "public", "uploads");
const savedDataPath = path.join(root, "src", "lib", "saved-data.ts");

function getArg(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index >= 0 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }
  return fallback;
}

function sanitizeFileName(fileName) {
  const cleaned = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return cleaned || `upload-${Date.now()}`;
}

function ensureUploadsDirectory() {
  if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
  }
}

function createSavedDataModule(content) {
  return `export const savedData = ${JSON.stringify(content, null, 2)};\n`;
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const host = getArg("--host", process.env.HOST ?? "127.0.0.1");
const port = Number(getArg("--port", process.env.PORT ?? "5173"));
const httpServer = http.createServer();

const vite = await createViteServer({
  root,
  appType: "spa",
  server: {
    middlewareMode: true,
    // Pass the httpServer so Vite 8 handles HMR WebSocket upgrades internally
    ws: false,
  },
});

httpServer.on("request", async (req, res) => {
  const requestUrl = new URL(req.url ?? "/", `http://${host}:${port}`);
  const pathname = requestUrl.pathname;

  if (pathname === "/api/save-content" && req.method === "POST") {
    try {
      const body = await readRequestBody(req);
      const content = JSON.parse(body.toString("utf8"));
      fs.writeFileSync(savedDataPath, createSavedDataModule(content));
      sendJson(res, 200, { success: true });
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : "Could not save content.",
      });
    }
    return;
  }

  if (pathname === "/api/upload-asset" && req.method === "POST") {
    try {
      ensureUploadsDirectory();
      const rawName =
        typeof req.headers["x-file-name"] === "string"
          ? req.headers["x-file-name"]
          : `upload-${Date.now()}`;
      const fileName = sanitizeFileName(rawName);
      const filePath = path.join(uploadsDirectory, fileName);
      const body = await readRequestBody(req);
      fs.writeFileSync(filePath, body);
      sendJson(res, 200, { url: `/uploads/${fileName}` });
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : "Could not upload file.",
      });
    }
    return;
  }

  vite.middlewares(req, res, () => {
    res.statusCode = 404;
    res.end("Not Found");
  });
});

httpServer.listen(port, host, () => {
  console.log(`\n  Local:   http://${host}:${port}/`);
  console.log(`  Admin:   http://${host}:${port}/admin\n`);
});

const shutdown = async () => {
  await vite.close();
  httpServer.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => { void shutdown(); });
process.on("SIGTERM", () => { void shutdown(); });
