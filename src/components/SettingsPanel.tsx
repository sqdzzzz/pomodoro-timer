import { useState } from 'react'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { useTranslation } from '@/hooks/useTranslation'
import { requestNotificationPermission } from '@/utils/notification'
import type { TimerSettings } from '@/types'
import type { Language } from '@/i18n'

export function SettingsPanel() {
  const { settings, language, updateSettings, setLanguage } = usePomodoroStore((state) => ({
    settings: state.settings,
    language: state.language,
    updateSettings: state.updateSettings,
    setLanguage: state.setLanguage,
  }))
  const t = useTranslation()

  const [isOpen, setIsOpen] = useState(false)

  const handleToggleNotifications = async () => {
    if (!settings.notificationEnabled) {
      const permission = await requestNotificationPermission()
      updateSettings({ notificationEnabled: permission === 'granted' })
    } else {
      updateSettings({ notificationEnabled: false })
    }
  }

  const SETTING_GROUPS: {
    key: keyof TimerSettings
    label: string
    min: number
    max: number
    step: number
    unit: string
  }[] = [
    { key: 'workMinutes', label: t.settings.workMinutes, min: 1, max: 60, step: 1, unit: t.settings.minutes },
    { key: 'shortBreakMinutes', label: t.settings.shortBreak, min: 1, max: 30, step: 1, unit: t.settings.minutes },
    { key: 'longBreakMinutes', label: t.settings.longBreak, min: 1, max: 60, step: 1, unit: t.settings.minutes },
    { key: 'longBreakInterval', label: t.settings.longBreakInterval, min: 1, max: 10, step: 1, unit: t.settings.pomodorosUnit },
  ]

  const LANGUAGES: { value: Language; label: string }[] = [
    { value: 'zh', label: '中文' },
    { value: 'en', label: 'English' },
  ]

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center justify-between w-full p-4 rounded-2xl glass transition-colors duration-200 hover:bg-[var(--bg-secondary)]"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium text-[var(--text-primary)]">{t.settings.title}</span>
        </div>
        <svg
          className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-3 p-5 rounded-2xl glass space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">{t.settings.language}</span>
            <div className="inline-flex p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    language === lang.value
                      ? 'text-white bg-gradient-tomato shadow-md shadow-tomato-500/25'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {SETTING_GROUPS.map((group) => (
            <div key={group.key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-[var(--text-secondary)]">{group.label}</label>
                <span className="text-xs font-medium text-[var(--text-primary)] tabular-nums">
                  {settings[group.key] as number} {group.unit}
                </span>
              </div>
              <input
                type="range"
                min={group.min}
                max={group.max}
                step={group.step}
                value={settings[group.key] as number}
                onChange={(e) =>
                  updateSettings({ [group.key]: Number(e.target.value) } as Partial<TimerSettings>)
                }
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--border-color)] accent-tomato-500"
                style={{ accentColor: '#ff6b6b' }}
              />
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-[var(--text-secondary)]">{t.settings.sound}</span>
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                settings.soundEnabled ? 'bg-tomato-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">{t.settings.notifications}</span>
            <button
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                settings.notificationEnabled ? 'bg-tomato-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  settings.notificationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
