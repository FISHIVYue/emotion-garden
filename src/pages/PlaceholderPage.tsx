import { AmbientBackground } from '../components/AmbientBackground'
import { BottomNavigation } from '../components/BottomNavigation'
import './PlaceholderPage.css'

const content = {
  timeline: { eyebrow: 'GROWTH RINGS', title: '年轮', copy: '那些被温柔记下的天气，会在这里长成属于你的时间纹理。', motif: 'rings' },
  forest: { eyebrow: 'RESONANCE FOREST', title: '森林', copy: '未来，这里会收留匿名的心事，以及不带压力的微小共鸣。', motif: 'forest' },
  profile: { eyebrow: 'YOUR GARDEN', title: '我的', copy: '植物档案、偏好与隐私设置将在后续阶段安静地生长出来。', motif: 'profile' },
} as const

export function PlaceholderPage({ type }: { type: keyof typeof content }) {
  const item = content[type]
  return (
    <div className="page page--with-nav placeholder-page"><AmbientBackground /><header><p className="eyebrow">{item.eyebrow}</p><h1 className="page-title">{item.title}</h1></header><div className={`placeholder-page__motif placeholder-page__motif--${item.motif}`} aria-hidden="true"><i /><i /><i /></div><section><span>第一阶段 · 静候生长</span><p>{item.copy}</p></section><BottomNavigation /></div>
  )
}
