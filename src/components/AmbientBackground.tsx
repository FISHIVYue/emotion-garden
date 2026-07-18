import './AmbientBackground.css'
import type { PlantState } from '../types/emotion'

export function AmbientBackground({ darker = false, state }: { darker?: boolean; state?: PlantState }) {
  return (
    <div className={`ambient ${darker ? 'ambient--darker' : ''} ${state ? `ambient--${state}` : ''}`} aria-hidden="true">
      <span className="ambient__image" />
      <span className="ambient__veil" />
      <span className="ambient__glow ambient__glow--one" />
      <span className="ambient__glow ambient__glow--two" />
      <span className="ambient__fog-image" />
      <span className="ambient__grain" />
    </div>
  )
}
