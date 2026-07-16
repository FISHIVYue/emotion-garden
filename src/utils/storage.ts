import type { GardenState, PlantId } from '../types'

const STORAGE_KEY = 'emotion-garden:state:v1'
const initialState: GardenState = { questionnaireCompleted: false, plantId: null, answers: [] }

export function readGardenState(): GardenState {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (!value) return initialState
    return { ...initialState, ...JSON.parse(value) as GardenState }
  } catch {
    return initialState
  }
}

export function saveGardenState(state: GardenState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function completeQuestionnaire(answers: number[], plantId: PlantId) {
  saveGardenState({ questionnaireCompleted: true, plantId, answers })
}

export function setExistingPlant() {
  saveGardenState({ questionnaireCompleted: true, plantId: 'silver-fern', answers: [] })
}
