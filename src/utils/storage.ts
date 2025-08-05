import { TOTPEntry } from './totp';

const STORAGE_KEY = 'totp-entries';

export function saveEntries(entries: TOTPEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save entries to localStorage:', error);
  }
}

export function loadEntries(): TOTPEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load entries from localStorage:', error);
    return [];
  }
}

export function addEntry(entry: TOTPEntry): TOTPEntry[] {
  const entries = loadEntries();
  const newEntries = [...entries, entry];
  saveEntries(newEntries);
  return newEntries;
}

export function removeEntry(id: string): TOTPEntry[] {
  const entries = loadEntries();
  const newEntries = entries.filter(entry => entry.id !== id);
  saveEntries(newEntries);
  return newEntries;
}