import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { QuestionCard } from '../components/QuestionCard'
import { questions } from '../data/questions'
import { completeQuestionnaire } from '../utils/storage'
import { matchPlant } from '../utils/matchPlant'
import './QuestionnairePage.css'

export function QuestionnairePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const selected = answers[step]
  const select = (index: number) => setAnswers((current) => { const next = [...current]; next[step] = index; return next })
  const goBack = () => step === 0 ? navigate('/') : setStep((value) => value - 1)
  const goNext = () => {
    if (selected === undefined) return
    if (step < questions.length - 1) { setStep((value) => value + 1); return }
    const plantId = matchPlant(answers)
    completeQuestionnaire(answers, plantId)
    navigate('/plant-match')
  }

  return (
    <div className="page questionnaire-page">
      <AmbientBackground />
      <header className="questionnaire-page__header">
        <button type="button" className="icon-button" onClick={goBack} aria-label="返回上一页"><span aria-hidden="true">←</span></button>
        <div className="questionnaire-page__progress-wrap">
          <span>{String(step + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</span>
          <div className="questionnaire-page__progress" role="progressbar" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={step + 1}><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
        </div>
      </header>
      <div className="questionnaire-page__card" key={step}><QuestionCard question={questions[step]} selected={selected} onSelect={select} /></div>
      <footer className="questionnaire-page__footer">
        <span className="questionnaire-page__sprout" aria-hidden="true"><i /><i /></span>
        <button type="button" className="primary-button" disabled={selected === undefined} onClick={goNext}>{step === questions.length - 1 ? '遇见我的植物' : '继续'}</button>
      </footer>
    </div>
  )
}
