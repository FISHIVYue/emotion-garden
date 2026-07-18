import type { PlantState } from '../types/emotion'

export const plantStates = ['calm', 'bright', 'tired', 'anxious', 'rainy', 'stormy', 'foggy', 'mixed'] as const satisfies readonly PlantState[]

export function getPreviewPlantState(search: string, isDevelopment = import.meta.env.DEV): PlantState | null {
  if (!isDevelopment) return null
  const candidate = new URLSearchParams(search).get('previewState')
  return plantStates.find((state) => state === candidate) ?? null
}
