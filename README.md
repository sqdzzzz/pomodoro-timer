# 番茄工作法计时器（Pomodoro Timer）

一个基于 **React 18**、**TypeScript**、**Vite**、**Tailwind CSS**、**Zustand** 和 **Recharts** 打造的极简现代番茄钟。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/typescript-5.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/vite-5.3-646CFF?logo=vite)

## 功能特性

- **经典番茄工作流**：25 分钟专注、5 分钟短休息、15 分钟长休息
- **自动长休息**：每完成 4 个番茄钟后自动进入长休息
- **开始 / 暂停 / 重置**：完全掌控计时器
- **桌面通知**：计时结束通过浏览器 Notification API 提醒
- **声音提醒**：使用 Web Audio API 播放柔和提示音
- **每日统计**：记录今日完成番茄数与总进度
- **周统计图表**：使用 Recharts 可视化最近 7 天数据
- **数据持久化**：所有设置与统计数据保存至 LocalStorage
- **深色模式**：无缝切换浅色 / 深色主题
- **多语言**：默认中文，可在设置内切换至 English（中文 / English）
- **响应式设计**：桌面端与移动端均有良好体验

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 18 |
| 开发语言 | TypeScript |
| 构建工具 | Vite |
| 样式方案 | Tailwind CSS |
| 状态管理 | Zustand（含 persist 持久化中间件） |
| 图表库 | Recharts |
| 图标 | 内联 SVG |

## 项目结构

```
pomodoro-timer/
├── .github/workflows/   # GitHub Actions 部署工作流
├── public/              # 静态资源
├── src/
│   ├── components/      # UI 组件
│   ├── hooks/           # 自定义 React Hooks
│   ├── store/           # Zustand 状态管理
│   ├── types/           # TypeScript 类型
│   ├── utils/           # 工具函数
│   ├── App.tsx          # 根组件
│   ├── index.css        # 全局样式
│   └── main.tsx         # 应用入口
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── LICENSE
└── README.md
```

## 快速开始

### 环境要求

- Node.js 18+
- npm、yarn 或 pnpm

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/sqdzzzz/pomodoro-timer.git
cd pomodoro-timer

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:5173/pomodoro-timer/](http://localhost:5173/pomodoro-timer/)。

### 构建

```bash
npm run build
```

生产构建产物将输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

## 部署

### GitHub Pages

本项目已包含 GitHub Actions 工作流（`.github/workflows/deploy.yml`），每次 push 到 `main` 分支会自动构建并部署到 GitHub Pages。

1. 将仓库推送到 GitHub
2. 进入 **Settings → Pages**
3. 将 **Source** 设置为 "GitHub Actions"
4. 工作流将自动部署到 `https://sqdzzzz.github.io/pomodoro-timer/`

### 手动部署

```bash
npm run build
npm run deploy
```

> 注意：`npm run deploy` 使用 `gh-pages` 将 `dist/` 目录发布到 GitHub Pages。

## 配置项

可通过设置面板自定义计时时长与行为：

- 专注时长
- 短休息时长
- 长休息时长
- 长休息间隔
- 开启 / 关闭提示音
- 开启 / 关闭桌面通知

## 浏览器支持

- Chrome / Edge（最新版）
- Firefox（最新版）
- Safari（最新版）

桌面通知需要在安全上下文（HTTPS 或 localhost）中运行。

## 截图

> 运行应用后可将截图替换到此处。

![浅色模式](./screenshots/light-mode.png)
![深色模式](./screenshots/dark-mode.png)

## 开源协议

本项目基于 [MIT License](./LICENSE) 开源。

## 致谢

灵感来源于 [番茄工作法](https://francescocirillo.com/products/the-pomodoro-technique) 与 [Linear](https://linear.app/) 的简洁设计。
