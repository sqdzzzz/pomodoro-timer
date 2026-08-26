import type { Language } from '@/i18n'

export type TimerMode = 'work' | 'shortBreak' | 'longBreak'

export interface TimerSettings {
  workMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundEnabled: boolean
  notificationEnabled: boolean
}

export interface DailyRecord {
  date: string // YYYY-MM-DD
  count: number
}

export interface PomodoroState {
  mode: TimerMode
  timeLeft: number // seconds
  isRunning: boolean
  completedPomodoros: number
  todayCompleted: number
  records: DailyRecord[]
  settings: TimerSettings
  language: Language
}

export interface PomodoroActions {
  start: () => void
  pause: () => void
  reset: () => void
  tick: () => void
  complete: () => void
  setMode: (mode: TimerMode) => void
  updateSettings: (settings: Partial<TimerSettings>) => void
  setLanguage: (language: Language) => void
}

export type PomodoroStore = PomodoroState & PomodoroActions
