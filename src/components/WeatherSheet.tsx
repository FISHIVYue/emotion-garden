import { useEffect } from 'react'
import './WeatherSheet.css'

const weather = [
  { name: '晴朗', icon: 'sun' }, { name: '阴天', icon: 'cloud' }, { name: '小雨', icon: 'rain' },
  { name: '雷雨', icon: 'storm' }, { name: '雾', icon: 'fog' }, { name: '无法描述', icon: 'unknown' },
]

function WeatherIcon({ type }: { type: string }) {
  return <span className={`weather-icon weather-icon--${type}`} aria-hidden="true"><i /><b /></span>
}

export function WeatherSheet({ onClose }: { onClose: () => void }) {
  useEffect(() => { const handler = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler) }, [onClose])
  return (
    <div className="sheet-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="weather-sheet" role="dialog" aria-modal="true" aria-labelledby="weather-title">
        <div className="weather-sheet__handle" /><div className="weather-sheet__head"><div><p className="eyebrow">此刻的天气</p><h2 id="weather-title">今天，心里是什么天气？</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="关闭">×</button></div>
        <p className="body-copy">不用判断好坏，选一个最接近的就好。</p>
        <div className="weather-grid">{weather.map((item) => <button key={item.name} type="button" onClick={onClose}><WeatherIcon type={item.icon}/><span>{item.name}</span></button>)}</div>
        <p className="weather-sheet__note">第一阶段暂不保存完整记录，选择后将返回花园。</p>
      </section>
    </div>
  )
}
