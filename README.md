# Pomodoro Timer

A minimalist, modern Pomodoro timer built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Zustand**, and **Recharts**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/typescript-5.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/vite-5.3-646CFF?logo=vite)

## Features

- **Classic Pomodoro workflow**: 25 minutes focus, 5 minutes short break, 15 minutes long break
- **Auto long break**: Automatically enters a long break after every 4 completed pomodoros
- **Start / Pause / Reset**: Full control over your timer
- **Desktop notifications**: Browser Notification API alerts you when a session ends
- **Sound alerts**: Soft beep using the Web Audio API
- **Daily statistics**: Track today's completed pomodoros and total progress
- **Weekly chart**: Visualize your last 7 days with Recharts
- **Persistent data**: All settings and statistics are saved to LocalStorage
- **Dark mode**: Seamless light/dark theme toggle
- **Responsive design**: Works beautifully on desktop and mobile

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State Management | Zustand (with persist middleware) |
| Charts | Recharts |
| Icons | Inline SVG |

## Project Structure

```
pomodoro-timer/
├── .github/workflows/   # GitHub Actions for deployment
├── public/              # Static assets
├── src/
│   ├── components/      # UI components
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Root component
│   ├── index.css        # Global styles
│   └── main.tsx         # Application entry
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pomodoro-timer.git
cd pomodoro-timer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/pomodoro-timer/](http://localhost:5173/pomodoro-timer/) in your browser.

### Build

```bash
npm run build
```

The production build will be output to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### GitHub Pages

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages on every push to `main`.

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Set **Source** to "GitHub Actions"
4. The workflow will deploy to `https://your-username.github.io/pomodoro-timer/`

### Manual Deployment

```bash
npm run build
npm run deploy
```

> Note: `npm run deploy` uses `gh-pages` to publish the `dist/` folder.

## Configuration

You can customize the timer durations and behavior through the settings panel:

- Focus length
- Short break length
- Long break length
- Long break interval
- Sound on/off
- Notifications on/off

## Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)

Desktop notifications require a secure context (HTTPS or localhost).

## Screenshots

> Add screenshots here after running the app.

![Timer Light Mode](./screenshots/light-mode.png)
![Timer Dark Mode](./screenshots/dark-mode.png)

## License

This project is licensed under the [MIT License](./LICENSE).

## Acknowledgements

Inspired by the [Pomodoro Technique](https://francescocirillo.com/products/the-pomodoro-technique) and the clean design of [Linear](https://linear.app/).
