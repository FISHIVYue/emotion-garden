import type { Question } from '../types'
import './QuestionCard.css'

export function QuestionCard({ question, selected, onSelect }: { question: Question; selected?: number; onSelect: (index: number) => void }) {
  return (
    <section className="question-card">
      <p className="question-card__note">{question.note}</p>
      <h1 className="question-card__title">{question.prompt}</h1>
      <div className="question-card__options" role="radiogroup" aria-label={question.prompt}>
        {question.options.map((option, index) => (
          <button key={option} type="button" role="radio" aria-checked={selected === index} className={`question-option ${selected === index ? 'question-option--selected' : ''}`} onClick={() => onSelect(index)}>
            <span>{option}</span><span className="question-option__mark" aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  )
}
