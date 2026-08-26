import { usePomodoroStore } from '@/store/pomodoroStore'

export function StatsPanel() {
  const { todayCompleted, completedPomodoros } = usePomodoroStore((state) => ({
    todayCompleted: state.todayCompleted,
    completedPomodoros: state.completedPomodoros,
  }))

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="glass rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
        <div className="text-sm font-medium text-[var(--text-muted)] mb-1">Today</div>
        <div className="text-3xl font-semibold text-gradient">{todayCompleted}</div>
        <div className="text-xs text-[var(--text-secondary)] mt-1">pomodoros</div>
      </div>

      <div className="glass rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
        <div className="text-sm font-medium text-[var(--text-muted)] mb-1">Total</div>
        <div className="text-3xl font-semibold text-[var(--text-primary)]">{completedPomodoros}</div>
        <div className="text-xs text-[var(--text-secondary)] mt-1">completed</div>
      </div>
    </div>
  )
}
