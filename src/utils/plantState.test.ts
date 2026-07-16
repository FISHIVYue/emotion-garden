import { describe, expect, it } from 'vitest'
import { mapEmotionToPlantState } from './plantState'

describe('mapEmotionToPlantState', () => {
  it.each([
    ['sunny', ['joy'], 3, 'bright'],
    ['cloudy', ['calm'], 2, 'calm'],
    ['cloudy', ['tired'], 3, 'tired'],
    ['wind', ['anxious'], 4, 'anxious'],
    ['rain', [], 2, 'rainy'],
    ['storm', [], 4, 'stormy'],
    ['fog', [], 2, 'foggy'],
    ['sunny', ['joy', 'sad'], 3, 'mixed'],
  ] as const)('maps %s with %s to %s', (weather, emotions, intensity, expected) => {
    expect(mapEmotionToPlantState({ weather, emotions: [...emotions], intensity })).toBe(expected)
  })

  it('does not treat a strong negative feeling as plant damage', () => {
    expect(mapEmotionToPlantState({ weather: 'storm', emotions: ['angry'], intensity: 5 })).toBe('stormy')
  })
})
