import { useMemo, useState } from 'react'
import { AmbientBackground } from '../components/AmbientBackground'
import { BottomNavigation } from '../components/BottomNavigation'
import { PlantIllustration } from '../components/PlantIllustration'
import { WeatherSheet } from '../components/WeatherSheet'
import { getPlant } from '../data/plants'
import { readGardenState } from '../utils/storage'
import './GardenPage.css'

function getGreeting() { const hour = new Date().getHours(); if (hour < 11) return '早上好'; if (hour < 18) return '下午好'; return '晚上好' }

export function GardenPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const plant = getPlant(readGardenState().plantId)
  const dateLabel = useMemo(() => new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date()), [])
  return (
    <div className="page page--with-nav garden-page">
      <AmbientBackground darker />
      <header className="garden-page__header"><div><p className="eyebrow">{dateLabel}</p><h1>{getGreeting()}，慢慢来。</h1></div><button type="button" className="garden-page__light" aria-label="移动花园里的光线"><span /></button></header>
      <section className="garden-page__stage" aria-labelledby="plant-name"><div className="garden-page__orbit" /><PlantIllustration plantId={plant.id} /><div className="garden-page__label"><span>与你共生</span><h2 id="plant-name">{plant.name}</h2><small>{plant.species}</small></div></section>
      <section className="garden-page__response"><span className="garden-page__line" aria-hidden="true" /><p>{plant.stateLine}</p></section>
      <div className="garden-page__actions"><button type="button" className="primary-button" onClick={() => setSheetOpen(true)}>记录此刻</button><button type="button" className="secondary-button garden-page__touch" onClick={() => setSheetOpen(true)}><span aria-hidden="true">◌</span> 轻触叶片，看看此刻的天气</button></div>
      <BottomNavigation />
      {sheetOpen && <WeatherSheet onClose={() => setSheetOpen(false)} />}
    </div>
  )
}
