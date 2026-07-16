import { useCallback, useEffect, useState } from 'react'
import { EMOTION_CHANGE_EVENT, emotionRepository } from '../services/emotionRepository'
import type { EmotionEntry } from '../types/emotion'

export function useEmotionEntries() {
  const [entries, setEntries] = useState<EmotionEntry[]>(() => emotionRepository.getAll())
  const refresh = useCallback(() => setEntries(emotionRepository.getAll()), [])

  useEffect(() => {
    window.addEventListener(EMOTION_CHANGE_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => { window.removeEventListener(EMOTION_CHANGE_EVENT, refresh); window.removeEventListener('storage', refresh) }
  }, [refresh])

  return { entries, latest: entries[0] ?? null, refresh }
}
