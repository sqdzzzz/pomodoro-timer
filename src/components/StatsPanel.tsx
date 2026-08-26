import { usePomodoroStore } from '@/store/pomodoroStore'
import { useTranslation } from '@/hooks/useTranslation'

export function StatsPanel() {
  const { todayCompleted, completedPomodoros } = usePomodoroStore((state) => ({
    todayCompleted: state.todayCompleted,
    completedPomodoros: state.completedPomodoros,
  }))
  const t = useTranslation()

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="glass rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
        <div className="text-sm font-medium text-[var(--text-muted)] mb-1">{t.stats.today}</div>
        <div className="text-3xl font-semibold text-gradient">{todayCompleted}</div>
        <div className="text-xs text-[var(--text-secondary)] mt-1">{t.stats.pomodoros}</div>
      </div>

      <div className="glass rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5">
        <div className="text-sm font-medium text-[var(--text-muted)] mb-1">{t.stats.total}</div>
        <div className="text-3xl font-semibold text-[var(--text-primary)]">{completedPomodoros}</div>
        <div className="text-xs text-[var(--text-secondary)] mt-1">{t.stats.completed}</div>
      </div>
    </div>
  )
}
