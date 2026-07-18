import { describe, expect, it } from 'vitest'
import { FOREST_STORAGE_KEY, ForestRepository } from './forestRepository'
import type { StorageAdapter } from './storage'

class MemoryStorage implements StorageAdapter { data=new Map<string,string>(); getItem(key:string){return this.data.get(key)??null};setItem(key:string,value:string){this.data.set(key,value)} }

describe('ForestRepository',()=>{
  it('persists publishing, light, hidden and reported state',()=>{
    const storage=new MemoryStorage();const repository=new ForestRepository(storage)
    const own=repository.publish('留给森林的一句话','fog',new Date('2026-07-17T08:00:00.000Z'))
    repository.toggleLight('forest-fern-rain');repository.hide('forest-moss-voice');repository.report('forest-ivy-wind')
    const restored=new ForestRepository(storage)
    expect(restored.getMyPosts()[0].content).toBe('留给森林的一句话')
    expect(restored.getVisiblePosts().find((post)=>post.id==='forest-fern-rain')?.lightCount).toBe(13)
    expect(restored.getVisiblePosts().some((post)=>post.id==='forest-moss-voice')).toBe(false)
    expect(restored.getState().reportedPostIds).toContain('forest-ivy-wind')
    expect(JSON.parse(storage.getItem(FOREST_STORAGE_KEY)??'{}').version).toBe(1)
    repository.deleteOwn(own.id);expect(repository.getMyPosts()).toHaveLength(0)
  })
})
