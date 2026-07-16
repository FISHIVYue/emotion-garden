import { useEffect, useState } from 'react'
import './BreathingExperience.css'

const DURATION = 24

export function BreathingExperience({ onClose }: { onClose: () => void }) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => {
      if (value >= DURATION - 1) { window.clearInterval(timer); return DURATION }
      return value + 1
    }), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const phase = seconds === DURATION ? '已经很好了' : Math.floor(seconds / 4) % 2 === 0 ? '慢慢吸气' : '轻轻呼气'

  return (
    <div className="breathing-layer" role="dialog" aria-modal="true" aria-labelledby="breathing-title">
      <button type="button" className="breathing-layer__close" onClick={onClose}>提前结束</button>
      <div className="breathing-layer__center">
        <p className="eyebrow">WITH YOUR PLANT</p>
        <h2 id="breathing-title">陪植物呼吸</h2>
        <div className={`breathing-orbit ${seconds === DURATION ? 'breathing-orbit--done' : ''}`} aria-hidden="true"><i /><i /></div>
        <p className="breathing-layer__phase" aria-live="polite">{phase}</p>
        <span>{seconds === DURATION ? '这段安静已经留在花园里。' : `${DURATION - seconds} 秒 · 只需留意光圈的节奏`}</span>
      </div>
      {seconds === DURATION && <button type="button" className="primary-button" onClick={onClose}>回到花园</button>}
    </div>
  )
}
