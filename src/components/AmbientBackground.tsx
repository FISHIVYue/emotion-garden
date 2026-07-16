import './AmbientBackground.css'

export function AmbientBackground({ darker = false }: { darker?: boolean }) {
  return (
    <div className={`ambient ${darker ? 'ambient--darker' : ''}`} aria-hidden="true">
      <span className="ambient__glow ambient__glow--one" />
      <span className="ambient__glow ambient__glow--two" />
      <span className="ambient__mist ambient__mist--one" />
      <span className="ambient__mist ambient__mist--two" />
      <span className="ambient__grain" />
    </div>
  )
}
