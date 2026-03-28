import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-content',
      configureServer(server) {
        server.middlewares.use((req: any, res: any, next) => {
          if (req.url === '/api/save-content' && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const contentStr = JSON.stringify(JSON.parse(body), null, 2);
                const fileContent = `export const savedData = ${contentStr};\n`;
                const dataPath = path.resolve(__dirname, 'src/lib/saved-data.ts');
                fs.writeFileSync(dataPath, fileContent);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } catch(e: any) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
});
