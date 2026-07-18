import { describe, expect, it } from 'vitest'
import { getPreviewPlantState, plantStates } from './previewPlantState'

describe('getPreviewPlantState', () => {
  it.each(plantStates)('accepts %s in development', (state) => {
    expect(getPreviewPlantState(`?previewState=${state}`, true)).toBe(state)
  })

  it('ignores unknown values', () => {
    expect(getPreviewPlantState('?previewState=wilted', true)).toBeNull()
  })

  it('never overrides the real state in production', () => {
    expect(getPreviewPlantState('?previewState=bright', false)).toBeNull()
  })
})
