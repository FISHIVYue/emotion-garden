import type { EmotionWeather } from './emotion'

export interface ForestPost {
  id: string
  content: string
  weather: EmotionWeather
  createdAt: string
  plantAvatar: string
  lightCount: number
  isLocalUser: boolean
}

export interface ForestStore {
  version: 1
  localPosts: ForestPost[]
  lightedPostIds: string[]
  hiddenPostIds: string[]
  reportedPostIds: string[]
}
