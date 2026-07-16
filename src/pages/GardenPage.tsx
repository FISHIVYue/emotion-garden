import { useMemo, useState } from 'react'
import { AmbientBackground } from '../components/AmbientBackground'
import { BreathingExperience } from '../components/BreathingExperience'
import { BottomNavigation } from '../components/BottomNavigation'
import { EmotionCheckInSheet } from '../components/EmotionCheckInSheet'
import { PlantIllustration } from '../components/PlantIllustration'
import { PlantStateLayer } from '../components/PlantStateLayer'
import { plantStateCopy } from '../data/emotionOptions'
import { getPlant } from '../data/plants'
import { useEmotionEntries } from '../hooks/useEmotionEntries'
import { readGardenState } from '../utils/storage'
import './GardenPage.css'

function getGreeting() { const hour = new Date().getHours(); if (hour < 11) return '早上好'; if (hour < 18) return '下午好'; return '晚上好' }

export function GardenPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [breathing, setBreathing] = useState(false)
  const [lightMessage, setLightMessage] = useState('')
  const { latest, refresh } = useEmotionEntries()
  const plant = getPlant(readGardenState().plantId)
  const plantState = latest?.plantState ?? 'calm'
  const dateLabel = useMemo(() => new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date()), [])
  const latestTime = latest ? new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(latest.createdAt)) : null
  const saved = () => { refresh(); setSheetOpen(false); setLightMessage('这份感受已经被花园接住。'); window.setTimeout(() => setLightMessage(''), 3200) }
  const giveLight = () => { setLightMessage('一束光落在叶片上，停留了一会儿。'); window.setTimeout(() => setLightMessage(''), 3200) }
  return (
    <div className={`page page--with-nav garden-page garden-page--${plantState}`}>
      <AmbientBackground darker state={plantState} />
      <header className="garden-page__header"><div><p className="eyebrow">{dateLabel}</p><h1>{getGreeting()}，慢慢来。</h1></div><button type="button" className="garden-page__light" onClick={giveLight} aria-label="给植物一束光"><span /></button></header>
      <section className="garden-page__stage" aria-labelledby="plant-name"><div className="garden-page__orbit" /><PlantStateLayer state={plantState}/><PlantIllustration plantId={plant.id} state={plantState} /><div className="garden-page__label"><span>与你共生</span><h2 id="plant-name">{plant.name}</h2><small>{plant.species}</small></div></section>
      <section className="garden-page__response"><span className="garden-page__line" aria-hidden="true" /><div><p>{latest ? plantStateCopy[plantState] : plant.stateLine}</p><small>{latestTime ? `最近记录于 ${latestTime}` : '还没有记录，花园正在安静等你。'}</small></div></section>
      <div className="garden-page__actions"><button type="button" className="primary-button" onClick={() => setSheetOpen(true)}>记录此刻</button><div className="garden-page__gentle-actions"><button type="button" className="secondary-button" onClick={giveLight}>给植物一束光</button><button type="button" className="secondary-button" onClick={() => setBreathing(true)}>陪植物呼吸</button></div></div>
      {lightMessage && <div className="garden-page__toast" role="status">{lightMessage}</div>}
      <BottomNavigation />
      {sheetOpen && <EmotionCheckInSheet onClose={() => setSheetOpen(false)} onSaved={saved} />}
      {breathing && <BreathingExperience onClose={() => setBreathing(false)} />}
    </div>
  )
}
