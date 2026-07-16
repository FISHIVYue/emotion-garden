export type PlantId = 'mimosa' | 'silver-fern' | 'succulent' | 'water-lily' | 'ivy' | 'moon-orchid'

export interface PlantProfile {
  id: PlantId
  name: string
  species: string
  trait: string
  sharedQuality: string
  ritual: string
  stateLine: string
}

export interface GardenState {
  questionnaireCompleted: boolean
  plantId: PlantId | null
  answers: number[]
}

export interface Question {
  id: string
  prompt: string
  note: string
  options: string[]
}
