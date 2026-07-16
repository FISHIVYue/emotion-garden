import { plants } from '../data/plants'
import type { PlantId } from '../types'

export function matchPlant(answers: number[]): PlantId {
  const stableScore = answers.reduce((total, answer, index) => total + (answer + 1) * (index + 3), 0)
  return plants[stableScore % plants.length].id
}
