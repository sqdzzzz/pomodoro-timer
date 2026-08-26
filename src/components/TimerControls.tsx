import { usePomodoroStore } from '@/store/pomodoroStore'

export function TimerControls() {
  const { isRunning, start, pause, reset } = usePomodoroStore((state) => ({
    isRunning: state.isRunning,
    start: state.start,
    pause: state.pause,
    reset: state.reset,
  }))

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={isRunning ? pause : start}
        className={`group flex items-center justify-center w-16 h-16 rounded-2xl text-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-tomato-500/30 ${
          isRunning ? 'bg-slate-700 hover:bg-slate-800' : 'bg-gradient-tomato hover:shadow-tomato-500/30'
        }`}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? (
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <button
        onClick={reset}
        className="flex items-center justify-center w-14 h-14 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-4 focus:ring-tomato-500/20"
        aria-label="Reset timer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  )
}
