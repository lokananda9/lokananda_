import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  defaultPortfolioContent,
  type PortfolioContent,
} from "./site-data";

const STORAGE_KEY = "portfolio-admin-content-v1";

type ContentContextValue = {
  content: PortfolioContent;
  updateField: (path: string, value: string) => void;
  addItem: (path: string, item: unknown) => void;
  removeItem: (path: string, index: number) => void;
  resetContent: () => void;
};

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeWithDefaults<T>(defaults: T, stored: unknown): T {
  if (Array.isArray(defaults)) {
    if (!Array.isArray(stored)) {
      return defaults;
    }

    if (defaults.length === 0) {
      return stored as T;
    }

    return stored.map((item, index) =>
      mergeWithDefaults(defaults[index] ?? defaults[0], item),
    ) as T;
  }

  if (isRecord(defaults)) {
    if (!isRecord(stored)) {
      return defaults;
    }

    const result: Record<string, unknown> = {};

    for (const key of Object.keys(defaults)) {
      result[key] = mergeWithDefaults(
        defaults[key as keyof typeof defaults],
        stored[key],
      );
    }

    return result as T;
  }

  return typeof stored === typeof defaults ? (stored as T) : defaults;
}

function setByPath<T>(source: T, path: string, value: string): T {
  const clone = structuredClone(source) as Record<string, unknown>;
  const parts = path.split(".");
  let current: Record<string, unknown> | unknown[] = clone;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const token = parts[index];
    const key = /^\d+$/.test(token) ? Number(token) : token;
    current = current[key as keyof typeof current] as Record<string, unknown>;
  }

  const lastToken = parts[parts.length - 1];
  const lastKey = /^\d+$/.test(lastToken) ? Number(lastToken) : lastToken;
  current[lastKey as keyof typeof current] = value;

  return clone as T;
}

function updateArrayByPath<T>(
  source: T,
  path: string,
  updater: (items: unknown[]) => unknown[],
): T {
  const clone = structuredClone(source) as Record<string, unknown>;
  const parts = path.split(".");
  let current: Record<string, unknown> | unknown[] = clone;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const token = parts[index];
    const key = /^\d+$/.test(token) ? Number(token) : token;
    current = current[key as keyof typeof current] as Record<string, unknown>;
  }

  const lastToken = parts[parts.length - 1];
  const lastKey = /^\d+$/.test(lastToken) ? Number(lastToken) : lastToken;
  const currentItems = current[lastKey as keyof typeof current];
  const safeItems = Array.isArray(currentItems) ? currentItems : [];
  current[lastKey as keyof typeof current] = updater([...safeItems]);

  return clone as T;
}

function readStoredContent(): PortfolioContent {
  if (typeof window === "undefined") {
    return structuredClone(defaultPortfolioContent);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return structuredClone(defaultPortfolioContent);
    }

    return mergeWithDefaults(defaultPortfolioContent, JSON.parse(raw));
  } catch {
    return structuredClone(defaultPortfolioContent);
  }
}

export function PortfolioContentProvider({ children }: PropsWithChildren) {
  const [content, setContent] = useState<PortfolioContent>(() => readStoredContent());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const updateField = (path: string, value: string) => {
    setContent((current) => setByPath(current, path, value));
  };

  const addItem = (path: string, item: unknown) => {
    setContent((current) =>
      updateArrayByPath(current, path, (items) => [
        ...items,
        structuredClone(item),
      ]),
    );
  };

  const removeItem = (path: string, index: number) => {
    setContent((current) =>
      updateArrayByPath(current, path, (items) =>
        items.filter((_, itemIndex) => itemIndex !== index),
      ),
    );
  };

  const resetContent = () => {
    setContent(structuredClone(defaultPortfolioContent));
  };

  return (
    <ContentContext.Provider
      value={{ content, updateField, addItem, removeItem, resetContent }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function usePortfolioContent() {
  const context = useContext(ContentContext);

  if (!context) {
    throw new Error("usePortfolioContent must be used inside PortfolioContentProvider.");
  }

  return context;
}
