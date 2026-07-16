# 07｜数据结构与模拟数据

## UserProfile

```ts
export interface UserProfile {
  id: string;
  nickname: string;
  onboardingCompleted: boolean;
  plantId: string;
  createdAt: string;
  preferences: {
    soundEnabled: boolean;
    reducedMotion: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}
```

## PlantProfile

```ts
export type PlantState =
  | 'mist'
  | 'calm'
  | 'happy-glow'
  | 'sad-dew'
  | 'anxious-folded'
  | 'angry-veins'
  | 'tired-droop'
  | 'mixed-light';

export interface PlantProfile {
  id: string;
  name: string;
  species: string;
  description: string;
  companionStyle: string;
  growthStage: 1 | 2 | 3 | 4 | 5;
  currentState: PlantState;
}
```

## EmotionEntry

```ts
export type EmotionWeather =
  | 'sunny'
  | 'cloudy'
  | 'rain'
  | 'storm'
  | 'fog'
  | 'wind'
  | 'humid'
  | 'unclear';

export interface EmotionEntry {
  id: string;
  createdAt: string;
  primaryWeather: EmotionWeather;
  secondaryWeather?: EmotionWeather;
  intensity: 1 | 2 | 3 | 4 | 5;
  emotions: string[];
  bodySignals: string[];
  triggers: string[];
  note: string;
  plantState: PlantState;
}
```

## ResonancePost

```ts
export type ResonanceType =
  | 'same-rain'
  | 'stay-with-you'
  | 'leave-light'
  | 'send-leaf';

export interface ResonancePost {
  id: string;
  plantAvatar: string;
  createdAt: string;
  weather: EmotionWeather;
  content: string;
  resonanceCounts: Record<ResonanceType, number>;
  isLocalUser?: boolean;
}
```

## DeviceData 预留

第一版只使用模拟数据，不接真实设备。

```ts
export interface DeviceData {
  source: 'mock' | 'apple-health' | 'health-connect' | 'other';
  heartRate?: number;
  restingHeartRate?: number;
  hrvTrend?: 'lower' | 'normal' | 'higher';
  sleepHours?: number;
  steps?: number;
  capturedAt?: string;
}
```

## 模拟树洞内容

```ts
export const mockPosts = [
  {
    content: '今天没有发生特别糟糕的事，但我就是很累。',
    weather: 'fog'
  },
  {
    content: '我终于说出了那句一直不敢说的话，虽然结果并不完美。',
    weather: 'rain'
  },
  {
    content: '晚上回家的路上有风，我突然觉得自己好像也能慢一点。',
    weather: 'wind'
  }
];
```

## 规则式回应文案

第一版使用模板，不接 AI：

```ts
const responses = {
  rain: [
    '这场雨不需要立刻停下来。',
    '你的植物把今天的雨留在了叶片上。'
  ],
  fog: [
    '暂时看不清也没有关系。',
    '植物正在雾里陪你慢慢辨认。'
  ],
  sunny: [
    '今天的光落在了新长出的叶片上。',
    '这份轻盈已经被花园记住了。'
  ]
};
```
