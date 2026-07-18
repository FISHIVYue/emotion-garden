import { describe, expect, it } from 'vitest'
import { EMOTION_STORAGE_KEY, EmotionRepository } from './emotionRepository'
import type { StorageAdapter } from './storage'

class MemoryStorage implements StorageAdapter {
  data = new Map<string,string>()
  getItem(key: string) { return this.data.get(key) ?? null }
  setItem(key: string, value: string) { this.data.set(key,value) }
}

const baseEntry = { weather: 'rain', emotions: ['sad'], intensity: 3, note: '今天下了一点雨', triggers: [], bodySignals: [], needs: [] } as const

describe('EmotionRepository', () => {
  it('saves a versioned entry and reads it back', () => {
    const storage = new MemoryStorage()
    const repository = new EmotionRepository(storage)
    const saved = repository.add({ ...baseEntry, emotions: [...baseEntry.emotions], triggers: [], bodySignals: [], needs: [] }, new Date('2026-07-17T08:30:00.000Z'))
    expect(saved.plantState).toBe('rainy')
    expect(repository.getAll()).toEqual([saved])
    expect(JSON.parse(storage.getItem(EMOTION_STORAGE_KEY) ?? '{}').version).toBe(1)
  })

  it('returns records for a day in chronological order', () => {
    const repository = new EmotionRepository(new MemoryStorage())
    repository.add({ ...baseEntry, emotions: ['sad'], triggers: [], bodySignals: [], needs: [] }, new Date('2026-07-17T11:00:00.000Z'))
    repository.add({ ...baseEntry, emotions: ['calm'], triggers: [], bodySignals: [], needs: [] }, new Date('2026-07-17T08:00:00.000Z'))
    const key = `${new Date('2026-07-17T08:00:00.000Z').getFullYear()}-${String(new Date('2026-07-17T08:00:00.000Z').getMonth()+1).padStart(2,'0')}-${String(new Date('2026-07-17T08:00:00.000Z').getDate()).padStart(2,'0')}`
    expect(repository.getByDate(key).map((entry) => entry.createdAt)).toEqual(['2026-07-17T08:00:00.000Z','2026-07-17T11:00:00.000Z'])
  })

  it('recovers safely from invalid stored data', () => {
    const storage = new MemoryStorage()
    storage.setItem(EMOTION_STORAGE_KEY,'not-json')
    expect(new EmotionRepository(storage).getAll()).toEqual([])
  })

  it('deletes one entry by id while preserving other entries from the same day', () => {
    const repository = new EmotionRepository(new MemoryStorage())
    const first = repository.add({ ...baseEntry, emotions: ['sad'], triggers: [], bodySignals: [], needs: [] }, new Date('2026-07-17T08:00:00.000Z'))
    const second = repository.add({ ...baseEntry, weather: 'sunny', emotions: ['joy'], triggers: [], bodySignals: [], needs: [] }, new Date('2026-07-17T11:00:00.000Z'))
    expect(repository.deleteEmotionEntry(second.id)).toBe(true)
    expect(repository.getAll().map((entry) => entry.id)).toEqual([first.id])
    expect(repository.getLatest()?.plantState).toBe('rainy')
  })

  it('returns an empty day and calm-compatible null latest after the final entry is deleted', () => {
    const repository = new EmotionRepository(new MemoryStorage())
    const entry = repository.add({ ...baseEntry, emotions: ['sad'], triggers: [], bodySignals: [], needs: [] }, new Date('2026-07-17T08:00:00.000Z'))
    expect(repository.deleteEmotionEntry(entry.id)).toBe(true)
    expect(repository.getByDate('2026-07-17')).toEqual([])
    expect(repository.getLatest()).toBeNull()
    expect(repository.deleteEmotionEntry('missing')).toBe(false)
  })

  it('surfaces storage write failures instead of reporting success', () => {
    const storage = new MemoryStorage()
    const repository = new EmotionRepository(storage)
    const entry = repository.add({ ...baseEntry, emotions: ['sad'], triggers: [], bodySignals: [], needs: [] })
    storage.setItem = () => { throw new Error('quota exceeded') }
    expect(() => repository.deleteEmotionEntry(entry.id)).toThrow('quota exceeded')
  })
})
