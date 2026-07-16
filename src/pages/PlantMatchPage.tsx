import { Navigate, useNavigate } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { PlantIllustration } from '../components/PlantIllustration'
import { getPlant } from '../data/plants'
import { readGardenState } from '../utils/storage'
import './PlantMatchPage.css'

export function PlantMatchPage() {
  const navigate = useNavigate()
  const state = readGardenState()
  if (!state.plantId) return <Navigate to="/questionnaire" replace />
  const plant = getPlant(state.plantId)
  return (
    <div className="page match-page">
      <AmbientBackground darker />
      <div className="match-page__intro"><p className="eyebrow">SYMBIOSIS FOUND</p><span>共生关系已建立</span></div>
      <div className="match-page__plant"><PlantIllustration plantId={plant.id} /></div>
      <section className="match-page__content">
        <p className="match-page__species">{plant.species}</p>
        <h1 className="display-title">{plant.name}</h1>
        <p className="match-page__trait">{plant.trait}</p>
        <p className="body-copy">{plant.sharedQuality}</p>
        <blockquote>“{plant.ritual}”</blockquote>
        <button type="button" className="primary-button" onClick={() => navigate('/garden')}>进入我的花园</button>
      </section>
    </div>
  )
}
