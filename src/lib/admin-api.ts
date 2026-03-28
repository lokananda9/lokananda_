import type { PortfolioContent } from "./site-data";

export function isLocalAdminEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  return import.meta.env.DEV;
}

function sanitizeFileName(fileName: string) {
  const cleaned = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return cleaned || `upload-${Date.now()}`;
}

async function readJsonResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String(data.error)
        : "The request failed.";
    throw new Error(message);
  }

  return data;
}

export async function savePortfolioContent(content: PortfolioContent) {
  const response = await fetch("/api/save-content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });

  await readJsonResponse(response);
}

export async function uploadPortfolioAsset(file: File) {
  const safeName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const response = await fetch("/api/upload-asset", {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "x-file-name": safeName,
    },
    body: file,
  });
  const data = (await readJsonResponse(response)) as { url: string };

  return data.url;
}
