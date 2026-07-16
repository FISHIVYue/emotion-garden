import './AmbientBackground.css'
import type { PlantState } from '../types/emotion'

export function AmbientBackground({ darker = false, state }: { darker?: boolean; state?: PlantState }) {
  return (
    <div className={`ambient ${darker ? 'ambient--darker' : ''} ${state ? `ambient--${state}` : ''}`} aria-hidden="true">
      <span className="ambient__glow ambient__glow--one" />
      <span className="ambient__glow ambient__glow--two" />
      <span className="ambient__mist ambient__mist--one" />
      <span className="ambient__mist ambient__mist--two" />
      <span className="ambient__grain" />
    </div>
  )
}
