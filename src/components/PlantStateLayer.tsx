import type { PlantState } from '../types/emotion'
import './PlantStateLayer.css'

export function PlantStateLayer({ state }: { state: PlantState }) {
  return (
    <div className={`plant-state-layer plant-state-layer--${state}`} aria-hidden="true">
      <span className="plant-state-layer__light" />
      <span className="plant-state-layer__weather plant-state-layer__weather--one" />
      <span className="plant-state-layer__weather plant-state-layer__weather--two" />
      <span className="plant-state-layer__weather plant-state-layer__weather--three" />
    </div>
  )
}
