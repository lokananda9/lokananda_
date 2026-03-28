import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  isLocalAdminEnabled,
  savePortfolioContent,
} from "./admin-api";
import {
  defaultPortfolioContent,
  type PortfolioContent,
} from "./site-data";

type SaveState = "idle" | "saving" | "saved" | "error";

type ContentContextValue = {
  content: PortfolioContent;
  updateField: (path: string, value: string) => void;
  addItem: (path: string, item: unknown) => void;
  removeItem: (path: string, index: number) => void;
  resetContent: () => void;
  saveContent: () => Promise<boolean>;
  hasUnsavedChanges: boolean;
  saveState: SaveState;
  saveMessage: string;
  localAdminEnabled: boolean;
};

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

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

function createInitialContent() {
  return structuredClone(defaultPortfolioContent);
}

export function PortfolioContentProvider({ children }: PropsWithChildren) {
  const localAdminEnabled = isLocalAdminEnabled();
  const [savedContent, setSavedContent] = useState<PortfolioContent>(() =>
    createInitialContent(),
  );
  const [content, setContent] = useState<PortfolioContent>(() =>
    createInitialContent(),
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState(
    localAdminEnabled
      ? "Edit locally, then save to update repo files before pushing to Git."
      : "Rendering committed portfolio content.",
  );

  const savedSnapshot = useMemo(() => JSON.stringify(savedContent), [savedContent]);
  const contentSnapshot = useMemo(() => JSON.stringify(content), [content]);
  const hasUnsavedChanges = savedSnapshot !== contentSnapshot;

  const updateField = (path: string, value: string) => {
    setContent((current) => setByPath(current, path, value));
    setSaveState("idle");
    setSaveMessage("Unsaved local changes.");
  };

  const addItem = (path: string, item: unknown) => {
    setContent((current) =>
      updateArrayByPath(current, path, (items) => [
        ...items,
        structuredClone(item),
      ]),
    );
    setSaveState("idle");
    setSaveMessage("Unsaved local changes.");
  };

  const removeItem = (path: string, index: number) => {
    setContent((current) =>
      updateArrayByPath(current, path, (items) =>
        items.filter((_, itemIndex) => itemIndex !== index),
      ),
    );
    setSaveState("idle");
    setSaveMessage("Unsaved local changes.");
  };

  const resetContent = () => {
    setContent(structuredClone(savedContent));
    setSaveState("idle");
    setSaveMessage("Reverted to the last saved file content.");
  };

  const saveContent = async () => {
    if (!localAdminEnabled) {
      setSaveState("error");
      setSaveMessage("Saving is available only while running locally with npm run dev.");
      return false;
    }

    setSaveState("saving");
    setSaveMessage("Saving changes to repo files...");

    try {
      await savePortfolioContent(content);
      const nextSaved = structuredClone(content);
      setSavedContent(nextSaved);
      setSaveState("saved");
      setSaveMessage(
        "Saved to src/lib/saved-data.ts. Commit the changed files and push to update Vercel.",
      );
      return true;
    } catch (error) {
      setSaveState("error");
      setSaveMessage(
        error instanceof Error ? error.message : "Could not save the content file.",
      );
      return false;
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        updateField,
        addItem,
        removeItem,
        resetContent,
        saveContent,
        hasUnsavedChanges,
        saveState,
        saveMessage,
        localAdminEnabled,
      }}
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
