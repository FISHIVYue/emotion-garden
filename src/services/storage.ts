export interface StorageAdapter {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function getBrowserStorage(): StorageAdapter | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readJson<T>(storage: StorageAdapter | null, key: string, fallback: T): T {
  if (!storage) return fallback
  try {
    const raw = storage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

export function writeJson<T>(storage: StorageAdapter | null, key: string, value: T) {
  if (!storage) throw new Error('本地存储暂时不可用')
  storage.setItem(key, JSON.stringify(value))
}
