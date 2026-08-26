import { useEffect } from 'react'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { useTranslation } from '@/hooks/useTranslation'
import { useTimer } from '@/hooks/useTimer'
import { useTheme } from '@/hooks/useTheme'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BackgroundLayer } from '@/components/BackgroundLayer'
import { ModeTabs } from '@/components/ModeTabs'
import { TimerDisplay } from '@/components/TimerDisplay'
import { TimerControls } from '@/components/TimerControls'
import { StatsPanel } from '@/components/StatsPanel'
import { WeeklyChart } from '@/components/WeeklyChart'
import { SettingsPanel } from '@/components/SettingsPanel'

function App() {
  const { mode, timeLeft, isRunning, setMode, language } = usePomodoroStore((state) => ({
    mode: state.mode,
    timeLeft: state.timeLeft,
    isRunning: state.isRunning,
    setMode: state.setMode,
    language: state.language,
  }))

  const t = useTranslation()

  useTimer()
  useDocumentTitle(timeLeft, mode, isRunning)
  const [theme, toggleTheme] = useTheme()

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
  }, [language])

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-4 py-8 sm:py-12 transition-colors duration-300">
      <BackgroundLayer />
      <header className="w-full max-w-md flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-tomato flex items-center justify-center shadow-lg shadow-tomato-500/25">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            {t.appName}
          </h1>
        </div>
        <ThemeToggle theme={theme} toggle={toggleTheme} />
      </header>

      <main className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="w-full flex flex-col items-center gap-6 p-6 sm:p-8 rounded-3xl glass shadow-2xl shadow-black/5">
          <ModeTabs mode={mode} onChange={setMode} />
          <TimerDisplay />
          <TimerControls />
        </div>

        <StatsPanel />
        <WeeklyChart />
        <SettingsPanel />
      </main>

      <footer className="mt-12 text-xs text-[var(--text-muted)]">
        {t.footer}
      </footer>
    </div>
  )
}

export default App
