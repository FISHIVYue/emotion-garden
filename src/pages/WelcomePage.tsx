import { useNavigate } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { PlantIllustration } from '../components/PlantIllustration'
import { setExistingPlant } from '../utils/storage'
import './WelcomePage.css'

export function WelcomePage() {
  const navigate = useNavigate()
  const enterWithPlant = () => { setExistingPlant(); navigate('/garden') }

  return (
    <div className="page welcome-page">
      <AmbientBackground />
      <header className="welcome-page__brand"><span className="welcome-page__seed" aria-hidden="true" />情绪花园 <small>INNER GARDEN</small></header>
      <div className="welcome-page__visual"><div className="welcome-page__veil" /><PlantIllustration compact /></div>
      <section className="welcome-page__content">
        <p className="eyebrow">A quiet place to feel</p>
        <h1 className="display-title">每一种情绪，<br />都有它生长的方式。</h1>
        <p className="body-copy">让一株植物陪你经历晴雨，安静地看见那些还没有名字的感受。</p>
        <div className="welcome-page__actions">
          <button type="button" className="primary-button" onClick={() => navigate('/questionnaire')}>寻找与我共生的植物</button>
          <button type="button" className="secondary-button" onClick={enterWithPlant}>已经拥有植物</button>
        </div>
      </section>
    </div>
  )
}
