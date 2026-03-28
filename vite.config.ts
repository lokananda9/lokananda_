/// <reference types="node" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: "local-admin-api",
      configureServer(server) {
        server.middlewares.use((req: any, res: any, next) => {
          // Upload an asset file into public/uploads/
          if (req.url === "/api/upload-asset" && req.method === "POST") {
            const rawName =
              (req.headers["x-file-name"] as string) || `upload-${Date.now()}`;
            const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, "-");
            const uploadsDir = path.resolve(__dirname, "public/uploads");

            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const filePath = path.resolve(uploadsDir, safeName);
            const chunks: Buffer[] = [];

            req.on("data", (chunk: Buffer) => chunks.push(chunk));
            req.on("end", () => {
              try {
                fs.writeFileSync(filePath, Buffer.concat(chunks));
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ url: `/uploads/${safeName}` }));
              } catch (e: any) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: e.message }));
              }
            });

            req.on("error", (e: any) => {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: e.message }));
            });

            return;
          }

          // Save portfolio content to src/lib/saved-data.ts
          if (req.url === "/api/save-content" && req.method === "POST") {
            let body = "";
            req.on("data", (chunk: any) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              try {
                const parsed = JSON.parse(body);
                const contentStr = JSON.stringify(parsed, null, 2);
                const fileContent = `export const savedData = ${contentStr};\n`;
                const dataPath = path.resolve(
                  __dirname,
                  "src/lib/saved-data.ts"
                );
                fs.writeFileSync(dataPath, fileContent);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));
              } catch (e: any) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: e.message }));
              }
            });
            return;
          }

          next();
        });
      },
    },
  ],
});
