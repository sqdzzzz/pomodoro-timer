import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PomodoroStore, TimerMode, DailyRecord } from '@/types'
import { getToday } from '@/utils/date'
import { sendNotification } from '@/utils/notification'
import { playNotificationSound } from '@/utils/audio'
import { translations } from '@/i18n'

const DEFAULT_SETTINGS = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  notificationEnabled: true,
}

const MODES: Record<TimerMode, keyof typeof DEFAULT_SETTINGS> = {
  work: 'workMinutes',
  shortBreak: 'shortBreakMinutes',
  longBreak: 'longBreakMinutes',
}

function getInitialTime(settings: typeof DEFAULT_SETTINGS, mode: TimerMode): number {
  return (settings[MODES[mode]] as number) * 60
}

function getNextMode(
  completed: number,
  settings: typeof DEFAULT_SETTINGS
): TimerMode {
  const isLongBreak = completed > 0 && completed % settings.longBreakInterval === 0
  return isLongBreak ? 'longBreak' : 'shortBreak'
}

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      mode: 'work',
      timeLeft: DEFAULT_SETTINGS.workMinutes * 60,
      isRunning: false,
      completedPomodoros: 0,
      todayCompleted: 0,
      records: [],
      settings: DEFAULT_SETTINGS,
      language: 'zh',

      start: () => set({ isRunning: true }),

      pause: () => set({ isRunning: false }),

      reset: () => {
        const { settings, mode } = get()
        set({ isRunning: false, timeLeft: getInitialTime(settings, mode) })
      },

      tick: () => {
        set((state) => {
          if (!state.isRunning || state.timeLeft <= 0) return state
          return { timeLeft: state.timeLeft - 1 }
        })
      },

      complete: () => {
        const state = get()
        const { settings, mode, completedPomodoros, todayCompleted, records, language } = state
        const t = translations[language].notifications

        let nextMode: TimerMode
        let newCompleted = completedPomodoros
        let newToday = todayCompleted
        let newRecords = records

        if (mode === 'work') {
          newCompleted = completedPomodoros + 1
          newToday = todayCompleted + 1

          const today = getToday()
          const idx = records.findIndex((r: DailyRecord) => r.date === today)
          if (idx >= 0) {
            newRecords = records.map((r: DailyRecord, i: number) =>
              i === idx ? { ...r, count: r.count + 1 } : r
            )
          } else {
            newRecords = [...records, { date: today, count: 1 }]
          }

          nextMode = getNextMode(newCompleted, settings)

          if (settings.soundEnabled) playNotificationSound()
          if (settings.notificationEnabled) {
            sendNotification(
              t.workDoneTitle,
              nextMode === 'longBreak' ? t.longBreakBody : t.shortBreakBody
            )
          }
        } else {
          nextMode = 'work'
          if (settings.soundEnabled) playNotificationSound()
          if (settings.notificationEnabled) {
            sendNotification(t.breakOverTitle, t.breakOverBody)
          }
        }

        set({
          mode: nextMode,
          timeLeft: getInitialTime(settings, nextMode),
          isRunning:
            (nextMode !== 'work' && settings.autoStartBreaks) ||
            (nextMode === 'work' && settings.autoStartPomodoros),
          completedPomodoros: newCompleted,
          todayCompleted: newToday,
          records: newRecords,
        })
      },

      setMode: (mode) => {
        const { settings } = get()
        set({
          mode,
          timeLeft: getInitialTime(settings, mode),
          isRunning: false,
        })
      },

      setLanguage: (language) => set({ language }),

      updateSettings: (partial) => {
        set((state) => {
          const newSettings = { ...state.settings, ...partial }
          return {
            settings: newSettings,
            timeLeft: state.isRunning
              ? state.timeLeft
              : getInitialTime(newSettings, state.mode),
          }
        })
      },
    }),
    {
      name: 'pomodoro-timer-storage',
      partialize: (state) => ({
        mode: state.mode,
        timeLeft: state.timeLeft,
        isRunning: false,
        completedPomodoros: state.completedPomodoros,
        todayCompleted: state.todayCompleted,
        records: state.records,
        settings: state.settings,
        language: state.language,
      }),
    }
  )
)
