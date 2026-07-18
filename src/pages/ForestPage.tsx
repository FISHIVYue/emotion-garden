import { useEffect, useState } from 'react'
import { AmbientBackground } from '../components/AmbientBackground'
import { optionLabel, weatherOptions } from '../data/emotionOptions'
import { useForest } from '../hooks/useForest'
import { forestRepository } from '../services/forestRepository'
import type { EmotionWeather } from '../types/emotion'
import type { ForestPost } from '../types/forest'
import './ForestPage.css'

const anonymousIdentities: Record<string, string> = {
  fern: '银叶蕨 · 雾中旅人',
  moss: '含羞草 · 林间来客',
  ivy: '常春藤 · 借光生长的人',
  lily: '月光兰 · 夜色观察者',
  sprout: '多肉植物 · 晨光收藏者',
  'silver-fern': '银叶蕨 · 静默书写者',
}

function MoreVerticalIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="9" cy="4" r="1.35" />
      <circle cx="9" cy="9" r="1.35" />
      <circle cx="9" cy="14" r="1.35" />
    </svg>
  )
}

function LightPointIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="9" cy="9" r="2.4" />
      <circle cx="9" cy="9" r="5.6" fill="none" />
    </svg>
  )
}

function PostCard({ post, lighted, reported, onNotice }: { post: ForestPost; lighted: boolean; reported: boolean; onNotice: (message: string) => void }) {
  const [menu, setMenu] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const time = new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(post.createdAt))
  const short = post.content.slice(0, 12)
  const identity = post.isLocalUser ? '银叶蕨 · 静默书写者' : anonymousIdentities[post.plantAvatar] ?? '一株途经森林的植物'
  const canExpand = post.content.length > 72
  const stays = post.lightCount > 0 ? `${post.lightCount} 人曾在这里停留` : '还没有人经过这里'

  const removePost = () => {
    forestRepository.deleteOwn(post.id)
    onNotice('这条树洞已从本机删除。')
  }

  return (
    <article className={`resonance-card resonance-card--${post.weather}`} data-post-id={post.id}>
      <button
        type="button"
        className="resonance-card__menu"
        aria-label={`更多操作：${short}`}
        aria-expanded={menu}
        onClick={() => { setMenu((value) => !value); setConfirmDelete(false) }}
      >
        <MoreVerticalIcon />
      </button>

      <header className="resonance-card__identity">
        <div className={`forest-avatar forest-avatar--${post.plantAvatar}`} aria-hidden="true"><i /><i /></div>
        <div className="resonance-card__identity-copy">
          <span>{identity}</span>
          <div className="resonance-card__meta">
            <time dateTime={post.createdAt}>{time} · {optionLabel(weatherOptions, post.weather)}</time>
            {post.isLocalUser && <small>我的树洞</small>}
          </div>
        </div>
      </header>

      <p className={expanded ? 'is-expanded' : ''}>{post.content}</p>
      {canExpand && <button type="button" className="resonance-card__expand" onClick={() => setExpanded((value) => !value)}>{expanded ? '收起叶笺' : '继续读下去'}</button>}
      {reported && <small className="resonance-card__reported">已提交本地举报标记</small>}

      <footer className="resonance-card__response">
        {post.isLocalUser ? (
          <span className="resonance-card__local-note">只在这台设备留存</span>
        ) : (
          <>
            <button
              type="button"
              className={`light-button ${lighted ? 'is-lighted' : ''}`}
              aria-pressed={lighted}
              aria-label={`给这条内容送一束光：${short}`}
              onClick={() => forestRepository.toggleLight(post.id)}
            >
              <LightPointIcon />
              <span>{lighted ? '一束光留在了这里' : '送一束光'}</span>
            </button>
            <small>{stays}</small>
          </>
        )}
      </footer>

      {menu && (
        <div className="resonance-card__popover" role="menu">
          {post.isLocalUser ? (
            confirmDelete ? (
              <div className="resonance-card__confirm">
                <span>确定让这片叶笺离开吗？</span>
                <div>
                  <button type="button" onClick={() => setConfirmDelete(false)}>暂不删除</button>
                  <button type="button" className="is-danger" aria-label={`确认删除：${short}`} onClick={removePost}>确认删除</button>
                </div>
              </div>
            ) : (
              <button type="button" aria-label={`删除内容：${short}`} onClick={() => setConfirmDelete(true)}>删除我发布的内容</button>
            )
          ) : (
            <>
              <button type="button" aria-label={`隐藏内容：${short}`} onClick={() => { forestRepository.hide(post.id); onNotice('这条内容已在你的森林中隐藏。') }}>隐藏这条内容</button>
              <button type="button" aria-label={`举报内容：${short}`} disabled={reported} onClick={() => { forestRepository.report(post.id); setMenu(false); onNotice('已记录举报，仅保存在本机。') }}>{reported ? '已经举报' : '举报这条内容'}</button>
            </>
          )}
        </div>
      )}
    </article>
  )
}

function ForestComposer({ onClose, onNotice }: { onClose: () => void; onNotice: (message: string) => void }) {
  const [content, setContent] = useState('')
  const [weather, setWeather] = useState<EmotionWeather>('fog')
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', handleKeyDown) }
  }, [onClose])
  const publish = () => { if (!content.trim()) return; forestRepository.publish(content, weather); onNotice('你的树洞已经落进森林。'); onClose() }
  return <div className="forest-compose-layer"><section className="forest-composer" role="dialog" aria-modal="true" aria-labelledby="forest-compose-title"><div className="forest-composer__handle" /><header><div><p className="eyebrow">LEAVE A WHISPER</p><h2 id="forest-compose-title">留下一段树洞</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="关闭发布弹层">×</button></header><p className="body-copy">它只会保存在这台设备上，以匿名植物的方式出现。</p><textarea autoFocus maxLength={500} value={content} onChange={(event) => setContent(event.target.value)} placeholder="写下此刻想留在森林里的话……" /><div className="forest-composer__weather">{weatherOptions.map((option) => <button key={option.value} type="button" aria-pressed={weather === option.value} onClick={() => setWeather(option.value)}>{option.label}</button>)}</div><footer><span>{content.length}/500</span><button type="button" className="primary-button" data-testid="publish-forest-post" disabled={!content.trim()} onClick={publish}>放进森林</button></footer></section></div>
}

export function ForestPage() {
  const [tab, setTab] = useState<'all' | 'mine'>('all')
  const [composer, setComposer] = useState(false)
  const [notice, setNotice] = useState('')
  const { posts, mine, state } = useForest()
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2800) }
  const list = tab === 'all' ? posts : mine
  return <div className="page page--with-nav forest-page"><AmbientBackground darker /><header className="forest-page__header"><div><p className="eyebrow">RESONANCE FOREST</p><h1 className="page-title">森林</h1></div><button type="button" className="forest-page__new" onClick={() => setComposer(true)}>留下树洞</button></header><p className="forest-page__intro">这里没有热度和排名。只是一些心事，在树影间彼此照见。</p><div className="forest-tabs" role="tablist"><button type="button" role="tab" aria-selected={tab === 'all'} onClick={() => setTab('all')}>森林里</button><button type="button" role="tab" aria-selected={tab === 'mine'} onClick={() => setTab('mine')}>我留下的 <span>{mine.length}</span></button></div><section className="forest-stream" aria-live="polite">{list.length ? list.map((post) => <PostCard key={post.id} post={post} lighted={state.lightedPostIds.includes(post.id)} reported={state.reportedPostIds.includes(post.id)} onNotice={showNotice} />) : <div className="forest-empty"><i /><p>{tab === 'mine' ? '你还没有留下树洞。' : '树影间暂时很安静。'}</p><span>{tab === 'mine' ? '想说的时候，再让一片叶子替你收着。' : '过一会儿再来看看也可以。'}</span></div>}</section>{notice && <div className="forest-notice" role="status">{notice}</div>}{composer && <ForestComposer onClose={() => setComposer(false)} onNotice={showNotice} />}</div>
}
