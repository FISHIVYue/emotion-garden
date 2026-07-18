import { Route, Routes, useLocation } from 'react-router-dom'
import { WelcomePage } from './pages/WelcomePage'
import { QuestionnairePage } from './pages/QuestionnairePage'
import { PlantMatchPage } from './pages/PlantMatchPage'
import { GardenPage } from './pages/GardenPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { TimelinePage } from './pages/TimelinePage'
import { ForestPage } from './pages/ForestPage'
import { MainNavigationLayout } from './components/MainNavigationLayout'
import './styles/app.css'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <main className="app-shell" aria-live="polite">
      <div className="page-transition" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/plant-match" element={<PlantMatchPage />} />
          <Route element={<MainNavigationLayout />}>
            <Route path="/garden" element={<GardenPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/timeline/:date" element={<TimelinePage />} />
            <Route path="/forest" element={<ForestPage />} />
            <Route path="/profile" element={<PlaceholderPage type="profile" />} />
          </Route>
          <Route path="*" element={<WelcomePage />} />
        </Routes>
      </div>
    </main>
  )
}

export default function App() {
  return <AnimatedRoutes />
}
