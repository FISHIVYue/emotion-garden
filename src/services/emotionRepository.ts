import type { EmotionEntry, EmotionStore, NewEmotionEntry } from '../types/emotion'
import { mapEmotionToPlantState } from '../utils/plantState'
import { localDateKey } from '../utils/date'
import { getBrowserStorage, readJson, writeJson, type StorageAdapter } from './storage'

export const EMOTION_STORAGE_KEY = 'emotion-garden:emotions:v1'
export const EMOTION_STORE_VERSION = 1 as const
export const EMOTION_CHANGE_EVENT = 'emotion-garden:emotions-changed'

const emptyStore: EmotionStore = { version: EMOTION_STORE_VERSION, entries: [] }

function isEmotionStore(value: unknown): value is EmotionStore {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<EmotionStore>
  return candidate.version === EMOTION_STORE_VERSION && Array.isArray(candidate.entries)
}

export class EmotionRepository {
  constructor(private readonly storage: StorageAdapter | null = getBrowserStorage()) {}

  getAll(): EmotionEntry[] {
    const stored = readJson<unknown>(this.storage, EMOTION_STORAGE_KEY, emptyStore)
    if (!isEmotionStore(stored)) return []
    return [...stored.entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  getLatest(): EmotionEntry | null { return this.getAll()[0] ?? null }

  getByDate(date: string): EmotionEntry[] {
    return this.getAll().filter((entry) => localDateKey(entry.createdAt) === date).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }

  add(input: NewEmotionEntry, now = new Date()): EmotionEntry {
    const entry: EmotionEntry = {
      ...input,
      id: globalThis.crypto?.randomUUID?.() ?? `${now.getTime()}-${Math.random().toString(16).slice(2)}`,
      createdAt: now.toISOString(),
      plantState: mapEmotionToPlantState(input),
    }
    const entries = [entry, ...this.getAll()]
    writeJson(this.storage, EMOTION_STORAGE_KEY, { version: EMOTION_STORE_VERSION, entries } satisfies EmotionStore)
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(EMOTION_CHANGE_EVENT))
    return entry
  }
}

export const emotionRepository = new EmotionRepository()
