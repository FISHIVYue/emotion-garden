import { useCallback, useEffect, useState } from 'react'
import { FOREST_CHANGE_EVENT, forestRepository } from '../services/forestRepository'

export function useForest() {
  const read = useCallback(() => ({ posts:forestRepository.getVisiblePosts(), mine:forestRepository.getMyPosts(), state:forestRepository.getState() }), [])
  const [data,setData] = useState(read)
  const refresh = useCallback(() => setData(read()), [read])
  useEffect(() => { window.addEventListener(FOREST_CHANGE_EVENT,refresh); window.addEventListener('storage',refresh); return()=>{window.removeEventListener(FOREST_CHANGE_EVENT,refresh);window.removeEventListener('storage',refresh)} },[refresh])
  return { ...data, refresh }
}
