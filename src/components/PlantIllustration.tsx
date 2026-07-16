import type { PlantId } from '../types'
import type { PlantState } from '../types/emotion'
import './PlantIllustration.css'

export function PlantIllustration({ plantId = 'silver-fern', compact = false, state = 'calm' }: { plantId?: PlantId; compact?: boolean; state?: PlantState }) {
  const isFlower = plantId === 'water-lily' || plantId === 'moon-orchid'
  const isSucculent = plantId === 'succulent'
  return (
    <div className={`plant-art plant-art--${plantId} plant-art--state-${state} ${compact ? 'plant-art--compact' : ''}`} role="img" aria-label={`${plantId} 植物插画，${state} 状态`}>
      <span className="plant-art__halo" />
      <svg viewBox="0 0 280 330" aria-hidden="true">
        <defs>
          <linearGradient id={`leaf-${plantId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--leaf-light)" /><stop offset="1" stopColor="var(--leaf-dark)" />
          </linearGradient>
          <radialGradient id={`flower-${plantId}`}><stop offset="0" stopColor="#f4eddb" /><stop offset="1" stopColor="var(--flower)" /></radialGradient>
        </defs>
        <ellipse className="plant-art__shadow" cx="140" cy="300" rx="72" ry="13" />
        <g className="plant-art__stem">
          <path d="M139 299 C137 236 143 172 140 100" />
          <path d="M141 254 C111 225 89 191 76 151" />
          <path d="M140 238 C172 209 188 172 196 130" />
          <path d="M140 210 C113 180 111 147 109 116" />
        </g>
        <g className="plant-art__leaves">
          {isSucculent ? (
            <>
              <ellipse cx="140" cy="237" rx="29" ry="70" transform="rotate(-3 140 237)" />
              <ellipse cx="111" cy="250" rx="27" ry="63" transform="rotate(-38 111 250)" />
              <ellipse cx="170" cy="250" rx="27" ry="63" transform="rotate(38 170 250)" />
              <ellipse cx="94" cy="271" rx="23" ry="51" transform="rotate(-65 94 271)" />
              <ellipse cx="188" cy="271" rx="23" ry="51" transform="rotate(65 188 271)" />
            </>
          ) : (
            <>
              <path d="M76 151 C36 129 31 93 43 70 C77 76 96 105 76 151Z" />
              <path d="M82 159 C43 163 28 186 31 211 C65 217 91 196 82 159Z" />
              <path d="M109 116 C77 88 79 54 96 34 C126 48 136 82 109 116Z" />
              <path d="M196 130 C233 106 249 119 253 145 C232 169 207 165 196 130Z" />
              <path d="M188 171 C224 164 242 181 237 207 C211 223 188 207 188 171Z" />
              <path d="M140 100 C119 68 132 34 151 21 C178 44 174 76 140 100Z" />
              <path d="M112 178 C79 166 65 140 72 119 C105 120 124 144 112 178Z" />
              <path d="M166 190 C198 177 215 191 214 215 C187 231 166 218 166 190Z" />
            </>
          )}
        </g>
        {isFlower && <g className="plant-art__flower" transform="translate(140 98)"><ellipse rx="22" ry="43" transform="rotate(0)" /><ellipse rx="22" ry="43" transform="rotate(72)" /><ellipse rx="22" ry="43" transform="rotate(144)" /><ellipse rx="22" ry="43" transform="rotate(216)" /><ellipse rx="22" ry="43" transform="rotate(288)" /><circle r="12" /></g>}
        <g className="plant-art__specks"><circle cx="72" cy="97" r="2" /><circle cx="221" cy="116" r="1.5" /><circle cx="185" cy="62" r="2" /></g>
      </svg>
    </div>
  )
}
