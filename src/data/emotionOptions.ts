import type { BodySignal, EmotionNeed, EmotionTag, EmotionTrigger, EmotionWeather, PlantState } from '../types/emotion'

export interface Option<T extends string> { value: T; label: string }

export const weatherOptions: Option<EmotionWeather>[] = [
  { value: 'sunny', label: '晴朗' }, { value: 'cloudy', label: '阴天' },
  { value: 'rain', label: '小雨' }, { value: 'storm', label: '雷雨' },
  { value: 'fog', label: '雾' }, { value: 'wind', label: '风' },
  { value: 'unclear', label: '无法描述' },
]

export const emotionOptions: Option<EmotionTag>[] = [
  { value: 'calm', label: '平静' }, { value: 'joy', label: '开心' }, { value: 'hopeful', label: '期待' },
  { value: 'tired', label: '疲惫' }, { value: 'anxious', label: '焦虑' }, { value: 'sad', label: '悲伤' },
  { value: 'angry', label: '生气' }, { value: 'lonely', label: '孤独' }, { value: 'numb', label: '麻木' },
  { value: 'confused', label: '混乱' },
]

export const triggerOptions: Option<EmotionTrigger>[] = [
  { value: 'work', label: '学习或工作' }, { value: 'relationships', label: '人际关系' },
  { value: 'family', label: '家庭' }, { value: 'body', label: '身体状态' }, { value: 'sleep', label: '睡眠' },
  { value: 'future', label: '对未来的担忧' }, { value: 'unknown', label: '没有明确原因' }, { value: 'other', label: '其他' },
]

export const bodySignalOptions: Option<BodySignal>[] = [
  { value: 'chest-tight', label: '胸口紧' }, { value: 'fast-heartbeat', label: '心跳较快' },
  { value: 'tense-shoulders', label: '肩颈紧张' }, { value: 'stomach', label: '胃部不适' },
  { value: 'heavy-head', label: '头脑发沉' }, { value: 'relaxed', label: '身体轻松' },
  { value: 'none', label: '没有明显感觉' }, { value: 'other', label: '其他' },
]

export const needOptions: Option<EmotionNeed>[] = [
  { value: 'alone', label: '独处' }, { value: 'listened', label: '被倾听' }, { value: 'rest', label: '休息' },
  { value: 'express', label: '表达' }, { value: 'company', label: '陪伴' }, { value: 'distraction', label: '转移注意力' },
  { value: 'uncertain', label: '我也不确定' },
]

export const plantStateCopy: Record<PlantState, string> = {
  calm: '叶片正以自己的节奏舒展，花园里没有需要追赶的事。',
  bright: '一束微光停在新叶上，这份轻盈已被花园记住。',
  tired: '叶片稍稍低垂，植物正在安全地保存力气。',
  anxious: '叶缘感受到细微的风，正慢慢寻找可以放松的方向。',
  rainy: '雨停在叶片上，没有催促它立刻落下。',
  stormy: '深色脉络接住了雷声，植物依然稳稳扎根。',
  foggy: '暂时看不清也没有关系，植物在雾里陪你辨认。',
  mixed: '两种光影同时落下，复杂也可以被完整地容纳。',
}

export function optionLabel<T extends string>(options: Option<T>[], value: T) {
  return options.find((option) => option.value === value)?.label ?? value
}
