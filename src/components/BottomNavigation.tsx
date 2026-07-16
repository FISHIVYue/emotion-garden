import { NavLink } from 'react-router-dom'
import './BottomNavigation.css'

const navItems = [
  { to: '/garden', label: '花园', icon: 'leaf' },
  { to: '/timeline', label: '年轮', icon: 'rings' },
  { to: '/forest', label: '森林', icon: 'trees' },
  { to: '/profile', label: '我的', icon: 'person' },
]

function NavIcon({ name }: { name: string }) {
  if (name === 'leaf') return <svg viewBox="0 0 24 24"><path d="M19 4C10 4 5 8 5 14c0 3 2 5 5 5 6 0 9-6 9-15Z"/><path d="M5 20c2-5 5-8 10-11"/></svg>
  if (name === 'rings') return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v20"/></svg>
  if (name === 'trees') return <svg viewBox="0 0 24 24"><path d="m7 3-4 8h3l-4 7h10l-3-6h3L7 3Z"/><path d="m16 5-3 6h2l-3 6h9l-3-6h2l-4-6ZM7 18v3m9-4v4"/></svg>
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/></svg>
}

export function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="主要导航">
      {navItems.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}><NavIcon name={item.icon}/><span>{item.label}</span></NavLink>)}
    </nav>
  )
}
