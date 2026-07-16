import { useEffect, useState } from 'react'
import { bodySignalOptions, emotionOptions, needOptions, triggerOptions, weatherOptions, type Option } from '../data/emotionOptions'
import { emotionRepository } from '../services/emotionRepository'
import type { BodySignal, EmotionEntry, EmotionNeed, EmotionTag, EmotionTrigger, EmotionWeather } from '../types/emotion'
import './EmotionCheckInSheet.css'

function ToggleGroup<T extends string>({ label, options, values, onChange }: { label: string; options: Option<T>[]; values: T[]; onChange: (values: T[]) => void }) {
  const toggle = (value: T) => onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value])
  return <fieldset className="check-in-field"><legend>{label}<small>可多选</small></legend><div className="check-in-chips">{options.map((option) => <button key={option.value} type="button" aria-pressed={values.includes(option.value)} onClick={() => toggle(option.value)}>{option.label}</button>)}</div></fieldset>
}

export function EmotionCheckInSheet({ onClose, onSaved }: { onClose: () => void; onSaved: (entry: EmotionEntry) => void }) {
  const [step, setStep] = useState(0)
  const [weather, setWeather] = useState<EmotionWeather | null>(null)
  const [emotions, setEmotions] = useState<EmotionTag[]>([])
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [note, setNote] = useState('')
  const [triggers, setTriggers] = useState<EmotionTrigger[]>([])
  const [bodySignals, setBodySignals] = useState<BodySignal[]>([])
  const [needs, setNeeds] = useState<EmotionNeed[]>([])
  const [error, setError] = useState('')

  useEffect(() => { const handler = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler) }, [onClose])

  const save = () => {
    if (!weather) { setError('先选择一种最接近的天气'); return }
    try {
      const entry = emotionRepository.add({ weather, emotions, intensity, note: note.trim(), triggers, bodySignals, needs })
      onSaved(entry)
    } catch {
      setError('这份记录暂时没能放进花园，请稍后再试。')
    }
  }

  return (
    <div className="check-in-layer" role="presentation">
      <section className="check-in-sheet" role="dialog" aria-modal="true" aria-labelledby="check-in-title">
        <div className="check-in-sheet__handle" />
        <header><div><p className="eyebrow">记录此刻 · {step + 1}/3</p><h2 id="check-in-title">{step === 0 ? '心里是什么天气？' : step === 1 ? '让感受多一点轮廓' : '还想留下些什么？'}</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="关闭记录弹层">×</button></header>
        <div className="check-in-sheet__body" key={step}>
          {step === 0 && <><p className="body-copy">不用判断好坏，只选一个最接近的就好。</p><div className="check-in-weather">{weatherOptions.map((option) => <button key={option.value} type="button" data-weather={option.value} aria-pressed={weather === option.value} onClick={() => { setWeather(option.value); setError('') }}><i aria-hidden="true" /><span>{option.label}</span></button>)}</div></>}
          {step === 1 && <><ToggleGroup label="哪些词更接近此刻？" options={emotionOptions} values={emotions} onChange={setEmotions}/><fieldset className="check-in-field intensity-field"><legend>这份感受此刻有多靠近？</legend><div className="intensity-leaves" role="radiogroup" aria-label="情绪强度">{([1,2,3,4,5] as const).map((value) => <button key={value} type="button" role="radio" aria-checked={intensity === value} aria-label={`强度 ${value}`} onClick={() => setIntensity(value)}><i className={intensity >= value ? 'is-lit' : ''}/><span>{value}</span></button>)}</div></fieldset><label className="note-field"><span>一句话记录 <small>选填</small></span><textarea maxLength={280} value={note} onChange={(event) => setNote(event.target.value)} placeholder="此刻发生了什么，或只是写下一句话……"/><small>{note.length}/280</small></label></>}
          {step === 2 && <><ToggleGroup label="可能来自哪里？" options={triggerOptions} values={triggers} onChange={setTriggers}/><ToggleGroup label="身体有什么感觉？" options={bodySignalOptions} values={bodySignals} onChange={setBodySignals}/><ToggleGroup label="此刻更需要什么？" options={needOptions} values={needs} onChange={setNeeds}/></>}
        </div>
        {error && <p className="check-in-error" role="alert">{error}</p>}
        <footer>{step > 0 && <button type="button" className="secondary-button" onClick={() => setStep((value) => value - 1)}>上一步</button>}{step === 0 && weather && <button type="button" className="secondary-button" data-testid="quick-save" onClick={save}>只记录天气</button>}{step < 2 ? <button type="button" className="primary-button" disabled={!weather} onClick={() => setStep((value) => value + 1)}>继续</button> : <button type="button" className="primary-button" data-testid="save-entry" onClick={save}>放进花园</button>}</footer>
      </section>
    </div>
  )
}
