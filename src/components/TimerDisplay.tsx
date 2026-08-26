import { usePomodoroStore } from '@/store/pomodoroStore'
import { formatTime } from '@/utils/formatTime'

export function TimerDisplay() {
  const { timeLeft, mode, settings } = usePomodoroStore((state) => ({
    timeLeft: state.timeLeft,
    mode: state.mode,
    settings: state.settings,
  }))

  const totalSeconds =
    mode === 'work'
      ? settings.workMinutes * 60
      : mode === 'shortBreak'
      ? settings.shortBreakMinutes * 60
      : settings.longBreakMinutes * 60

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 280 280">
        <circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="12"
        />
        <circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff8787" />
            <stop offset="100%" stopColor="#ff6b6b" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 flex flex-col items-center">
        <span className="text-6xl sm:text-7xl font-mono font-semibold tracking-tight text-[var(--text-primary)]">
          {formatTime(timeLeft)}
        </span>
        <span className="mt-2 text-sm font-medium text-[var(--text-secondary)] uppercase tracking-widest">
          {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
        </span>
      </div>
    </div>
  )
}
