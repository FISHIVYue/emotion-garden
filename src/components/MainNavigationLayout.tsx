import { Outlet } from 'react-router-dom'
import { BottomNavigation } from './BottomNavigation'

export function MainNavigationLayout() {
  return (
    <div className="main-navigation-layout">
      <div className="main-scroll-area" data-testid="main-scroll-area">
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  )
}
