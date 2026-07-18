import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { emotionOptions, optionLabel, plantStateCopy, weatherOptions } from '../data/emotionOptions'
import { useEmotionEntries } from '../hooks/useEmotionEntries'
import { emotionRepository } from '../services/emotionRepository'
import type { EmotionEntry } from '../types/emotion'
import { localDateKey } from '../utils/date'
import './TimelinePage.css'

const weekDays = ['一', '二', '三', '四', '五', '六', '日']
const pad = (value: number) => String(value).padStart(2, '0')
const dateKey = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`
const todayKey = (() => { const date = new Date(); return dateKey(date.getFullYear(), date.getMonth(), date.getDate()) })()

function monthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const leading = (firstDay + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  return [...Array(leading).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)] as Array<number | null>
}

function EntryDetail({ entry, onDelete }: { entry: EmotionEntry; onDelete: (entry: EmotionEntry) => void }) {
  const time = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(new Date(entry.createdAt))
  return <article className={`timeline-entry timeline-entry--${entry.plantState}`}><header><div><span>{optionLabel(weatherOptions,entry.weather)}</span><time dateTime={entry.createdAt}>{time}</time></div><button type="button" className="timeline-entry__delete" aria-label="删除这条情绪记录" onClick={() => onDelete(entry)}><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4.75 5.5h8.5M7 5.5V4.25h4V5.5m-5.25 0 .5 8h5.5l.5-8M8 8v3.5m2-3.5v3.5" /></svg></button></header>{entry.emotions.length > 0 && <div className="timeline-entry__tags">{entry.emotions.map((tag) => <span key={tag}>{optionLabel(emotionOptions,tag)}</span>)}</div>}{entry.note && <p>{entry.note}</p>}<small>{plantStateCopy[entry.plantState]}</small></article>
}

function DeleteConfirmation({ busy, error, onCancel, onConfirm }: { busy: boolean; error: string; onCancel: () => void; onConfirm: () => void }) {
  const dialogRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button')
    buttons?.[0]?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onCancel()
      if (event.key !== 'Tab' || !buttons?.length) return
      const first = buttons[0]; const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [busy, onCancel])
  return <div className="timeline-confirm-layer" role="presentation"><section ref={dialogRef} className="timeline-confirm" role="dialog" aria-modal="true" aria-labelledby="delete-confirm-title" aria-describedby="delete-confirm-description"><h2 id="delete-confirm-title">移除这段记录？</h2><p id="delete-confirm-description">它将从这一天的年轮中消失，此操作无法撤销。</p>{error && <small role="alert">{error}</small>}<div><button type="button" className="secondary-button" disabled={busy} onClick={onCancel}>保留记录</button><button type="button" className="timeline-confirm__remove" disabled={busy} onClick={onConfirm}>{busy ? '正在移除…' : '确认移除'}</button></div></section></div>
}

export function TimelinePage() {
  const navigate = useNavigate()
  const params = useParams<{ date?: string }>()
  const initialDate = params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? new Date(`${params.date}T00:00:00`) : new Date()
  const [month, setMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1))
  const { entries, refresh } = useEmotionEntries()
  const [pendingDelete, setPendingDelete] = useState<EmotionEntry | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [feedback, setFeedback] = useState('')
  const cells = useMemo(() => monthGrid(month.getFullYear(), month.getMonth()), [month])
  const entriesByDate = useMemo(() => entries.reduce<Record<string,EmotionEntry[]>>((map,entry) => { const key=localDateKey(entry.createdAt); (map[key] ??= []).push(entry); return map },{}), [entries])
  const selectedDate = params.date ?? null
  const selectedEntries = selectedDate ? [...(entriesByDate[selectedDate] ?? [])].sort((a,b) => a.createdAt.localeCompare(b.createdAt)) : []
  const monthLabel = new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'long'}).format(month)
  const shiftMonth = (amount: number) => { const next = new Date(month.getFullYear(),month.getMonth()+amount,1); setMonth(next); if(selectedDate) navigate('/timeline') }
  const selectDay = (day: number) => navigate(`/timeline/${dateKey(month.getFullYear(),month.getMonth(),day)}`)
  const requestDelete = (entry: EmotionEntry) => { setDeleteError(''); setPendingDelete(entry) }
  const confirmDelete = () => {
    if (!pendingDelete || deleting) return
    setDeleting(true); setDeleteError('')
    try {
      const removed = emotionRepository.deleteEmotionEntry(pendingDelete.id)
      refresh()
      setPendingDelete(null)
      if (removed) { setFeedback('这段记录已从年轮中轻轻移除。'); window.setTimeout(() => setFeedback(''), 3200) }
    } catch {
      setDeleteError('暂时没能移除这段记录，请稍后再试。')
    } finally { setDeleting(false) }
  }

  return (
    <div className="page page--with-nav timeline-page">
      <AmbientBackground />
      <header className="timeline-page__header"><div><p className="eyebrow">GROWTH RINGS</p><h1 className="page-title">年轮</h1></div><span>{entries.length === 0 ? '从第一片叶子开始' : `${entries.length} 份天气被收藏`}</span></header>
      <section className="natural-calendar" aria-label={monthLabel}>
        <header><button type="button" onClick={() => shiftMonth(-1)} aria-label="上一个月">←</button><h2>{monthLabel}</h2><button type="button" onClick={() => shiftMonth(1)} aria-label="下一个月">→</button></header>
        <div className="natural-calendar__week">{weekDays.map((day) => <span key={day}>{day}</span>)}</div>
        <div className="natural-calendar__days">{cells.map((day,index) => {
          if(day === null) return <span key={`empty-${index}`} />
          const key=dateKey(month.getFullYear(),month.getMonth(),day); const dayEntries=entriesByDate[key] ?? []; const state=dayEntries.at(-1)?.plantState
          return <button key={key} type="button" className={`${state ? `has-entry state-${state}` : ''} ${key === todayKey ? 'is-today' : ''} ${key === selectedDate ? 'is-selected' : ''}`} onClick={() => selectDay(day)} aria-label={`${key}${dayEntries.length ? `，${dayEntries.length}条记录` : '，没有记录'}`}><span>{day}</span>{state && <i aria-hidden="true" />}{dayEntries.length > 1 && <small>{dayEntries.length}</small>}</button>
        })}</div>
      </section>
      <section className="timeline-detail" aria-live="polite">
        {selectedDate ? <><header><div><p className="eyebrow">DAY SPECIMEN</p><h2>{new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric',weekday:'long'}).format(new Date(`${selectedDate}T00:00:00`))}</h2></div><button type="button" onClick={() => navigate('/timeline')} aria-label="关闭单日详情">×</button></header>{selectedEntries.length ? <div className="timeline-detail__entries">{selectedEntries.map((entry) => <EntryDetail key={entry.id} entry={entry} onDelete={requestDelete}/>)}</div> : <div className="timeline-empty"><i/><p>这一天没有留下记录。</p><span>空白也是时间自然经过的样子。</span></div>}</> : entries.length === 0 ? <div className="timeline-empty timeline-empty--main"><i/><p>年轮还没有长出第一片叶子。</p><span>当你记录一次心里的天气，它会安静地出现在这里。</span><button type="button" className="secondary-button" onClick={() => navigate('/garden')}>回花园记录此刻</button></div> : <div className="timeline-hint"><span aria-hidden="true">↟</span><p>轻触有叶片的日期，看看那天留下的天气。</p></div>}
      </section>
      {feedback && <div className="timeline-feedback" role="status">{feedback}</div>}
      {pendingDelete && <DeleteConfirmation busy={deleting} error={deleteError} onCancel={() => !deleting && setPendingDelete(null)} onConfirm={confirmDelete} />}
    </div>
  )
}
