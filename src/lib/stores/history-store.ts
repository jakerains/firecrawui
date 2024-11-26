import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryEntry {
  id: string;
  timestamp: string;
  type: 'crawl' | 'scrape' | 'extract' | 'map';
  url: string;
  status: 'success' | 'error';
  error?: string;
  results?: any;
}

interface HistoryState {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  removeEntry: (id: string) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) => set((state) => ({
        entries: [{
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        }, ...state.entries].slice(0, 100) // Keep last 100 entries
      })),
      clearHistory: () => set({ entries: [] }),
      removeEntry: (id) => set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id)
      })),
    }),
    {
      name: 'firecrawl-history',
    }
  )
);