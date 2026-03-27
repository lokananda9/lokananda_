import { useEffect, useState } from "react";

const DB_NAME = "portfolio-asset-store";
const STORE_NAME = "files";
const ASSET_PREFIX = "asset:";

type AssetRecord = {
  id: string;
  blob: Blob;
  name: string;
  type: string;
  updatedAt: number;
};

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function openAssetDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readAssetRecord(id: string) {
  const database = await openAssetDatabase();

  return new Promise<AssetRecord | null>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve((request.result as AssetRecord | undefined) ?? null);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => database.close();
  });
}

export function isAssetReference(value: string) {
  return value.startsWith(ASSET_PREFIX);
}

export async function saveAssetFile(file: File) {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return fileToDataUrl(file);
  }

  try {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const record: AssetRecord = {
      id,
      blob: file,
      name: file.name,
      type: file.type,
      updatedAt: Date.now(),
    };
    const database = await openAssetDatabase();

    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => database.close();
      transaction.onerror = () => database.close();
    });

    return `${ASSET_PREFIX}${id}`;
  } catch {
    return fileToDataUrl(file);
  }
}

export function useResolvedAssetUrl(reference: string) {
  const [resolvedUrl, setResolvedUrl] = useState(
    reference && !isAssetReference(reference) ? reference : "",
  );

  useEffect(() => {
    let isActive = true;
    let objectUrl = "";

    const resolveReference = async () => {
      if (!reference) {
        setResolvedUrl("");
        return;
      }

      if (!isAssetReference(reference)) {
        setResolvedUrl(reference);
        return;
      }

      try {
        const record = await readAssetRecord(reference.slice(ASSET_PREFIX.length));

        if (!isActive) {
          return;
        }

        if (!record) {
          setResolvedUrl("");
          return;
        }

        objectUrl = URL.createObjectURL(record.blob);
        setResolvedUrl(objectUrl);
      } catch {
        if (isActive) {
          setResolvedUrl("");
        }
      }
    };

    resolveReference();

    return () => {
      isActive = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [reference]);

  return resolvedUrl;
}
