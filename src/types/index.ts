import type { Language } from '@/i18n'

export type TimerMode = 'work' | 'shortBreak' | 'longBreak'

export type BackgroundType = 'video' | 'image' | 'none'

export type AlertSoundSource = 'default' | 'custom'

export interface TimerSettings {
  workMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundEnabled: boolean
  notificationEnabled: boolean
  // 背景与 BGM
  backgroundType: BackgroundType
  backgroundVideoVolume: number // 0-1；0 表示静音（muted 自动播放）
  backgroundVideoPaused: boolean // 暂停背景视频播放
  bgmEnabled: boolean
  bgmVolume: number // 0-1
  // 提醒音
  alertSound: AlertSoundSource
  // UI 透明度
  uiOpacity: number // 0-1
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
  /** 自定义文件版本号，上传/删除 IndexedDB 文件后自增，用于刷新 useIndexedFile */
  filesVersion: number
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
  bumpFilesVersion: () => void
}

export type PomodoroStore = PomodoroState & PomodoroActions
