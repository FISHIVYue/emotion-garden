# 06｜Codex 技术实现规格

## 项目类型

构建一个移动端优先的响应式 Web App，并支持基础 PWA 安装。

## 推荐技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Zustand 或 React Context
- localStorage 或 IndexedDB

Codex 可以根据现有环境调整，但不要引入大型复杂依赖。

## 项目要求

### 1. 可直接运行

必须提供：

- 安装命令
- 启动命令
- 构建命令
- 清晰 README
- `.env.example`，即使第一版不需要真实密钥

### 2. 组件化

至少拆分：

- `PlantStage`
- `PlantStateLayer`
- `EmotionWeatherPicker`
- `MoodIntensitySlider`
- `BottomNavigation`
- `QuestionCard`
- `JournalEntryCard`
- `ResonanceCard`
- `MonthlySummary`
- `AmbientBackground`
- `DeviceConnectionPlaceholder`

### 3. 页面路由

建议：

```text
/
/onboarding
/questionnaire
/plant-match
/garden
/check-in
/check-in/result
/timeline
/timeline/:date
/forest
/forest/new
/profile
/settings
```

### 4. 本地状态

第一版所有数据默认保存在浏览器本地。

必须支持：

- 刷新后数据保留
- 重置数据
- 首次进入与已完成问卷用户的不同跳转
- 添加情绪记录
- 修改植物状态
- 森林模拟内容加载

### 5. 植物状态映射

根据最近一条记录映射：

```text
calm -> calm
joy -> happy-glow
sadness -> sad-dew
anxiety -> anxious-folded
anger -> angry-veins
fatigue -> tired-droop
mixed -> mixed-light
```

禁止用“生命值”或“健康值”计算。

### 6. 动效

- 页面进入淡入与轻微上移
- 植物缓慢呼吸
- 环境雾层缓慢移动
- 提交记录后平滑切换植物状态
- 尊重 `prefers-reduced-motion`

### 7. 响应式

- 主要优化手机端
- 桌面端内容居中
- 不允许横向溢出
- 底部导航考虑安全区域 `env(safe-area-inset-bottom)`

### 8. 无障碍

- 所有按钮有可读标签
- 图片有 alt
- 键盘可以操作
- 颜色对比度基本合格
- 动画可减少

### 9. PWA

- Web App Manifest
- App 图标占位
- Service Worker 或 Vite PWA 插件
- 可安装
- 离线打开基础页面

## 代码风格

- TypeScript 严格模式
- 不使用 `any`，除非有清楚注释
- 组件保持短小
- 业务数据与 UI 分离
- 所有颜色、圆角、阴影使用设计 token
- 不在组件中硬编码大量文案

## 第一版无需实现

- 登录系统
- 数据库
- 云同步
- 支付
- AI API
- 手表 API
- 推送通知
- 真实社区后端

这些位置使用接口抽象或 TODO 注释预留，不要做假登录和假支付流程。
