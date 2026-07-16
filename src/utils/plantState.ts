import type { EmotionTag, EmotionWeather, NewEmotionEntry, PlantState } from '../types/emotion'

const unsettled = new Set<EmotionTag>(['anxious', 'sad', 'angry', 'lonely', 'numb', 'confused'])
const light = new Set<EmotionTag>(['calm', 'joy', 'hopeful'])

export function mapEmotionToPlantState(entry: Pick<NewEmotionEntry, 'weather' | 'emotions' | 'intensity'>): PlantState {
  const tags = new Set(entry.emotions)
  const hasLight = entry.emotions.some((tag) => light.has(tag))
  const hasUnsettled = entry.emotions.some((tag) => unsettled.has(tag))

  if (tags.has('confused') || (hasLight && hasUnsettled)) return 'mixed'
  if (entry.weather === 'storm' || (tags.has('angry') && entry.intensity >= 4)) return 'stormy'
  if (tags.has('tired') || tags.has('numb')) return 'tired'
  if (tags.has('anxious') || (entry.weather === 'wind' && entry.intensity >= 4)) return 'anxious'
  if (entry.weather === 'rain' || tags.has('sad') || tags.has('lonely')) return 'rainy'
  if (entry.weather === 'fog' || entry.weather === 'unclear') return 'foggy'
  if (entry.weather === 'sunny' || tags.has('joy') || tags.has('hopeful')) return 'bright'
  return 'calm'
}

export const stateForWeather: Record<EmotionWeather, PlantState> = {
  sunny: 'bright', cloudy: 'calm', rain: 'rainy', storm: 'stormy', fog: 'foggy', wind: 'anxious', unclear: 'foggy',
}
