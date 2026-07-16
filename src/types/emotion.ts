export type EmotionWeather = 'sunny' | 'cloudy' | 'rain' | 'storm' | 'fog' | 'wind' | 'unclear'

export type EmotionTag = 'calm' | 'joy' | 'hopeful' | 'tired' | 'anxious' | 'sad' | 'angry' | 'lonely' | 'numb' | 'confused'

export type EmotionTrigger = 'work' | 'relationships' | 'family' | 'body' | 'sleep' | 'future' | 'unknown' | 'other'

export type BodySignal = 'chest-tight' | 'fast-heartbeat' | 'tense-shoulders' | 'stomach' | 'heavy-head' | 'relaxed' | 'none' | 'other'

export type EmotionNeed = 'alone' | 'listened' | 'rest' | 'express' | 'company' | 'distraction' | 'uncertain'

export type PlantState = 'calm' | 'bright' | 'tired' | 'anxious' | 'rainy' | 'stormy' | 'foggy' | 'mixed'

export interface EmotionEntry {
  id: string
  createdAt: string
  weather: EmotionWeather
  emotions: EmotionTag[]
  intensity: 1 | 2 | 3 | 4 | 5
  note: string
  triggers: EmotionTrigger[]
  bodySignals: BodySignal[]
  needs: EmotionNeed[]
  plantState: PlantState
}

export type NewEmotionEntry = Omit<EmotionEntry, 'id' | 'createdAt' | 'plantState'>

export interface EmotionStore {
  version: 1
  entries: EmotionEntry[]
}
