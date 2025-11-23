interface PendingEntry {
  id: string;
  text_entry: string;
  mood: string | null;
  tags: string[] | null;
  initial_reframe: string;
  user_id: string;
  created_at: string;
}

const PENDING_ENTRIES_KEY = 'pending_journal_entries';
const CACHED_ENTRIES_KEY = 'cached_journal_entries';
const LAST_SYNC_KEY = 'last_sync_timestamp';

export function savePendingEntry(entry: PendingEntry): void {
  const pending = getPendingEntries();
  pending.push(entry);
  localStorage.setItem(PENDING_ENTRIES_KEY, JSON.stringify(pending));
}

export function getPendingEntries(): PendingEntry[] {
  const stored = localStorage.getItem(PENDING_ENTRIES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function clearPendingEntries(): void {
  localStorage.removeItem(PENDING_ENTRIES_KEY);
}

export function removePendingEntry(id: string): void {
  const pending = getPendingEntries();
  const filtered = pending.filter((e) => e.id !== id);
  localStorage.setItem(PENDING_ENTRIES_KEY, JSON.stringify(filtered));
}

export function cacheEntries(entries: any[]): void {
  localStorage.setItem(CACHED_ENTRIES_KEY, JSON.stringify(entries));
  localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
}

export function getCachedEntries(): any[] {
  const stored = localStorage.getItem(CACHED_ENTRIES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getLastSyncTime(): Date | null {
  const stored = localStorage.getItem(LAST_SYNC_KEY);
  return stored ? new Date(stored) : null;
}

export function isOnline(): boolean {
  return navigator.onLine;
}

export function generateOfflineId(): string {
  return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
