import type { TimerMode } from '@/types'

interface ModeTabsProps {
  mode: TimerMode
  onChange: (mode: TimerMode) => void
}

const MODES: { value: TimerMode; label: string }[] = [
  { value: 'work', label: 'Focus' },
  { value: 'shortBreak', label: 'Short Break' },
  { value: 'longBreak', label: 'Long Break' },
]

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  return (
    <div className="inline-flex p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
      {MODES.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
            mode === m.value
              ? 'text-white shadow-lg shadow-tomato-500/25'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {mode === m.value && (
            <span className="absolute inset-0 rounded-xl bg-gradient-tomato" />
          )}
          <span className="relative z-10">{m.label}</span>
        </button>
      ))}
    </div>
  )
}
