# emotion-garden

情绪花园（Inner Garden）是一个移动端优先的情绪陪伴 Web App。它用植物的叶片、光线、雾与生长状态温柔地表达日常感受，不做情绪好坏评分，也不制造打卡压力。

## 技术栈

- React
- TypeScript
- Vite
- React Router
- 原生 CSS 与 SVG
- localStorage

## 安装

```bash
npm install
```

## 本地启动

```bash
npm run dev
```

默认访问地址：`http://127.0.0.1:5173/`

## 类型检查

```bash
npm run typecheck
```

## 生产构建

```bash
npm run build
```

## 第一阶段已实现页面

- `/`：欢迎页
- `/questionnaire`：5 题植物匹配问卷
- `/plant-match`：植物匹配结果页
- `/garden`：今日花园首页与情绪天气底部弹层
- `/timeline`：年轮情绪日历
- `/timeline/:date`：单日情绪记录详情
- `/forest`：森林占位页
- `/profile`：我的占位页

问卷完成状态、答案和匹配植物保存在浏览器 localStorage。情绪记录使用独立的版本化本地仓储保存，并根据最近记录联动植物状态。植物视觉使用项目内原创 CSS/SVG，不依赖网络图片。

## 测试

```bash
# 单元测试
npm run test

# 基础 E2E（首次运行前安装 Playwright Chromium）
npx playwright install chromium
npm run test:e2e
```

E2E 会复用 `http://127.0.0.1:5173` 上已运行的开发服务器；没有运行时会自动启动。

## 当前阶段边界

当前仍未实现真实森林社区、账号与后端、AI、可穿戴设备、支付、推送或完整 PWA。
