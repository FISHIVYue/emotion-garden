import type { PlantProfile } from '../types'

export const plants: PlantProfile[] = [
  {
    id: 'mimosa', name: '含羞草', species: 'Mimosa pudica', trait: '敏锐而诚实',
    sharedQuality: '你们都能察觉细微变化，也懂得在需要时收拢自己。',
    ritual: '从今天起，让每一次合拢都不是退却，而是为下一次舒展积蓄力量。',
    stateLine: '叶片正安静感受着晨光，没有催促自己立刻打开。',
  },
  {
    id: 'silver-fern', name: '银叶蕨', species: 'Silver fern', trait: '安静地复原',
    sharedQuality: '你们都习惯在安静中恢复，也会在被理解后慢慢舒展开来。',
    ritual: '愿你们在薄雾中辨认彼此，以柔软的叶脉收藏每一种天气。',
    stateLine: '银色叶面浮着一层微光，正在自己的节奏里舒展。',
  },
  {
    id: 'succulent', name: '多肉植物', species: 'Succulent', trait: '把力量留在身体里',
    sharedQuality: '你们都擅长储存微小的温柔，在漫长时刻里保持自己的形状。',
    ritual: '愿每一滴被你珍藏的水，都在需要时成为继续生长的理由。',
    stateLine: '饱满的叶片守着柔和水分，今天适合缓慢而坚定。',
  },
  {
    id: 'water-lily', name: '睡莲', species: 'Nymphaea', trait: '在深处保持澄明',
    sharedQuality: '你们允许感受经过幽深水面，也仍愿意朝着光的方向开放。',
    ritual: '愿水面承接所有波纹，而你始终拥有一处可以盛放的中心。',
    stateLine: '水面只有细小波纹，花瓣在光影之间安静停留。',
  },
  {
    id: 'ivy', name: '常春藤', species: 'Hedera helix', trait: '温柔地寻找方向',
    sharedQuality: '你们不急着抵达，会沿着真实的感受一点点寻找可以依靠的地方。',
    ritual: '愿每一次转弯都长出新的支点，让连接成为自由，而非束缚。',
    stateLine: '藤蔓沿着光线生长了一小段，叶尖仍留着清晨的雾。',
  },
  {
    id: 'moon-orchid', name: '月光兰', species: 'Moon orchid', trait: '在静夜里发光',
    sharedQuality: '你们都有不轻易示人的丰盛，在安静与独处中听见真实的声音。',
    ritual: '愿不被看见的时刻也有月光抵达，照亮你隐秘而完整的花期。',
    stateLine: '淡色花瓣承接着微弱月光，花园因此多了一点宁静。',
  },
]

export function getPlant(id: PlantProfile['id'] | null | undefined) {
  return plants.find((plant) => plant.id === id) ?? plants[1]
}
