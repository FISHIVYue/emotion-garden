import { mockForestPosts } from '../data/forestPosts'
import type { EmotionWeather } from '../types/emotion'
import type { ForestPost, ForestStore } from '../types/forest'
import { getBrowserStorage, readJson, writeJson, type StorageAdapter } from './storage'

export const FOREST_STORAGE_KEY = 'emotion-garden:forest:v1'
export const FOREST_CHANGE_EVENT = 'emotion-garden:forest-changed'
const emptyStore: ForestStore = { version: 1, localPosts: [], lightedPostIds: [], hiddenPostIds: [], reportedPostIds: [] }

function normalize(value: unknown): ForestStore {
  if (!value || typeof value !== 'object') return emptyStore
  const store = value as Partial<ForestStore>
  if (store.version !== 1) return emptyStore
  return {
    version: 1,
    localPosts: Array.isArray(store.localPosts) ? store.localPosts : [],
    lightedPostIds: Array.isArray(store.lightedPostIds) ? store.lightedPostIds : [],
    hiddenPostIds: Array.isArray(store.hiddenPostIds) ? store.hiddenPostIds : [],
    reportedPostIds: Array.isArray(store.reportedPostIds) ? store.reportedPostIds : [],
  }
}

export class ForestRepository {
  constructor(private readonly storage: StorageAdapter | null = getBrowserStorage()) {}
  private read() { return normalize(readJson<unknown>(this.storage, FOREST_STORAGE_KEY, emptyStore)) }
  private write(store: ForestStore) { writeJson(this.storage, FOREST_STORAGE_KEY, store); if (typeof window !== 'undefined') window.dispatchEvent(new Event(FOREST_CHANGE_EVENT)) }

  getState() { return this.read() }
  getVisiblePosts(): ForestPost[] {
    const store = this.read()
    const posts = [...store.localPosts, ...mockForestPosts].filter((post) => !store.hiddenPostIds.includes(post.id))
    return posts.map((post) => ({ ...post, lightCount: post.lightCount + (store.lightedPostIds.includes(post.id) ? 1 : 0) })).sort((a,b) => b.createdAt.localeCompare(a.createdAt))
  }
  getMyPosts() { return this.read().localPosts.sort((a,b) => b.createdAt.localeCompare(a.createdAt)) }
  publish(content: string, weather: EmotionWeather, now = new Date()) {
    const store = this.read()
    const post: ForestPost = { id: globalThis.crypto?.randomUUID?.() ?? `${now.getTime()}-forest`, content: content.trim(), weather, createdAt: now.toISOString(), plantAvatar: 'silver-fern', lightCount: 0, isLocalUser: true }
    this.write({ ...store, localPosts: [post, ...store.localPosts] })
    return post
  }
  toggleLight(id: string) { const store=this.read(); const ids=store.lightedPostIds.includes(id)?store.lightedPostIds.filter((item)=>item!==id):[...store.lightedPostIds,id]; this.write({ ...store, lightedPostIds: ids }) }
  hide(id: string) { const store=this.read(); if(!store.hiddenPostIds.includes(id)) this.write({ ...store, hiddenPostIds:[...store.hiddenPostIds,id] }) }
  report(id: string) { const store=this.read(); if(!store.reportedPostIds.includes(id)) this.write({ ...store, reportedPostIds:[...store.reportedPostIds,id] }) }
  deleteOwn(id: string) { const store=this.read(); this.write({ ...store, localPosts:store.localPosts.filter((post)=>post.id!==id), lightedPostIds:store.lightedPostIds.filter((item)=>item!==id) }) }
}

export const forestRepository = new ForestRepository()
