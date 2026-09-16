import {
  LLMModel,
  TokenCalculation,
  ComparisonResult,
  CalculationHistory,
} from "@/types/llm";

// ═══════════════════════════════════════════════════════════
// localStorage Typed Helpers
// ═══════════════════════════════════════════════════════════

const KEYS = {
  LANGUAGE: "llm-calc-language",
  THEME: "llm-calc-theme",
  HISTORY: "llm-calc-history",
  FAVORITES: "llm-calc-favorites",
  PRICE_SNAPSHOTS: "llm-calc-price-snapshots",
  DASHBOARD_ENTRIES: "llm-calc-dashboard",
  ACTUAL_USAGE: "llm-calc-actual-usage",
} as const;

export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage write failed:", e);
  }
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

// ─── Language ──────────────────────────────────────────────
export type Language = "fr" | "en" | "ar";

export function getLanguage(): Language {
  return getItem<Language>(KEYS.LANGUAGE, "en");
}

export function setLanguage(lang: Language): void {
  setItem(KEYS.LANGUAGE, lang);
}

// ─── Theme ─────────────────────────────────────────────────
export type Theme = "dark" | "light" | "system";

export function getTheme(): Theme {
  return getItem<Theme>(KEYS.THEME, "light");
}

export function setTheme(theme: Theme): void {
  setItem(KEYS.THEME, theme);
}

// ─── Favorites ─────────────────────────────────────────────
export function getFavorites(): string[] {
  return getItem<string[]>(KEYS.FAVORITES, []);
}

export function setFavorites(ids: string[]): void {
  setItem(KEYS.FAVORITES, ids);
}

export function toggleFavorite(modelId: string): string[] {
  const favs = getFavorites();
  const next = favs.includes(modelId)
    ? favs.filter((id) => id !== modelId)
    : [...favs, modelId];
  setFavorites(next);
  return next;
}

// ─── History ───────────────────────────────────────────────
export interface HistoryEntry {
  id: string;
  timestamp: string;
  modelId: string;
  modelName: string;
  provider: string;
  inputText: string;
  outputText: string;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
}

export function getHistory(): HistoryEntry[] {
  return getItem<HistoryEntry[]>(KEYS.HISTORY, []);
}

export function addHistory(entry: HistoryEntry): void {
  const history = getHistory();
  history.unshift(entry);
  // Keep last 200 entries
  setItem(KEYS.HISTORY, history.slice(0, 200));
}

export function clearHistory(): void {
  setItem(KEYS.HISTORY, []);
}

export function deleteHistoryEntry(id: string): void {
  const history = getHistory().filter((e) => e.id !== id);
  setItem(KEYS.HISTORY, history);
}

// ─── Dashboard Entries ─────────────────────────────────────
export interface DashboardEntry {
  date: string; // YYYY-MM-DD
  modelId: string;
  totalCost: number;
  totalTokens: number;
}

export function getDashboardEntries(): DashboardEntry[] {
  return getItem<DashboardEntry[]>(KEYS.DASHBOARD_ENTRIES, []);
}

export function addDashboardEntry(entry: DashboardEntry): void {
  const entries = getDashboardEntries();
  entries.push(entry);
  setItem(KEYS.DASHBOARD_ENTRIES, entries.slice(-1000));
}

// ─── Price Snapshots ───────────────────────────────────────
export interface PriceSnapshot {
  date: string;
  models: { id: string; inputPrice: number; outputPrice: number }[];
}

export function getPriceSnapshots(): PriceSnapshot[] {
  return getItem<PriceSnapshot[]>(KEYS.PRICE_SNAPSHOTS, []);
}

export function addPriceSnapshot(snapshot: PriceSnapshot): void {
  const snaps = getPriceSnapshots();
  snaps.push(snapshot);
  setItem(KEYS.PRICE_SNAPSHOTS, snaps.slice(-100));
}

export interface ActualUsageRow {
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  actualCost: number;
  requestCount: number;
  date: string;
}

export function getActualUsage(): ActualUsageRow[] {
  return getItem<ActualUsageRow[]>(KEYS.ACTUAL_USAGE, []);
}

export function setActualUsage(rows: ActualUsageRow[]): void {
  setItem(KEYS.ACTUAL_USAGE, rows);
}

export { KEYS };
