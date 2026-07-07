import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { HarnessRecipe } from "./harness-generator";

export interface StoredRecipe {
  id: string;
  createdAt: number;
  useCase: string;
  recipe: HarnessRecipe;
}

const STORE_KEY = "harness:recipes";
const MAX_RECIPES = 20;

/** Drop the base64 diagram image: it can be multiple MB and would blow the localStorage quota / URL length. */
function stripImage(recipe: HarnessRecipe): HarnessRecipe {
  const copy = { ...recipe };
  delete copy.diagramImage;
  return copy;
}

function readStore(): StoredRecipe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is StoredRecipe =>
        !!entry &&
        typeof entry === "object" &&
        typeof (entry as StoredRecipe).id === "string" &&
        typeof (entry as StoredRecipe).createdAt === "number" &&
        !!(entry as StoredRecipe).recipe &&
        typeof (entry as StoredRecipe).recipe.domain === "string"
    );
  } catch {
    return [];
  }
}

function writeStore(entries: StoredRecipe[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    // Quota exceeded or storage disabled — drop oldest entries and retry once.
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(entries.slice(0, Math.ceil(entries.length / 2))));
      return true;
    } catch {
      return false;
    }
  }
}

export function listRecipes(): StoredRecipe[] {
  return readStore().sort((a, b) => b.createdAt - a.createdAt);
}

export function saveRecipe(useCase: string, recipe: HarnessRecipe): StoredRecipe | null {
  const entry: StoredRecipe = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    useCase,
    recipe: stripImage(recipe),
  };
  const entries = [entry, ...readStore()].slice(0, MAX_RECIPES);
  return writeStore(entries) ? entry : null;
}

export function updateRecipe(id: string, recipe: HarnessRecipe): void {
  const entries = readStore().map((entry) =>
    entry.id === id ? { ...entry, recipe: stripImage(recipe) } : entry
  );
  writeStore(entries);
}

export function deleteRecipe(id: string): StoredRecipe[] {
  const entries = readStore().filter((entry) => entry.id !== id);
  writeStore(entries);
  return entries.sort((a, b) => b.createdAt - a.createdAt);
}

// --- Share links ---------------------------------------------------------
// The recipe is lz-string-compressed into the URL *hash* so shared links
// work on the static export (the hash never reaches the server).

const SHARE_HASH_PREFIX = "#r=";
const MAX_SHARE_PAYLOAD = 100_000;

export function encodeRecipeShareHash(recipe: HarnessRecipe): string {
  return SHARE_HASH_PREFIX + compressToEncodedURIComponent(JSON.stringify(stripImage(recipe)));
}

export function decodeRecipeShareHash(hash: string): HarnessRecipe | null {
  if (!hash.startsWith(SHARE_HASH_PREFIX)) return null;
  const payload = hash.slice(SHARE_HASH_PREFIX.length);
  if (!payload || payload.length > MAX_SHARE_PAYLOAD) return null;
  try {
    const json = decompressFromEncodedURIComponent(payload);
    if (!json) return null;
    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const recipe = parsed as Partial<HarnessRecipe>;
    if (typeof recipe.domain !== "string" || typeof recipe.summary !== "string") return null;
    delete recipe.diagramImage;
    return recipe as HarnessRecipe;
  } catch {
    return null;
  }
}
