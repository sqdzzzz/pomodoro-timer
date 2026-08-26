import { useRef, useState } from 'react'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { useTranslation } from '@/hooks/useTranslation'
import { requestNotificationPermission } from '@/utils/notification'
import { saveFile, deleteFile, FILE_KEYS, type FileKey } from '@/utils/db'
import { useIndexedFile } from '@/hooks/useIndexedFile'
import type { TimerSettings, BackgroundType, AlertSoundSource } from '@/types'
import type { Language } from '@/i18n'

function FilePicker({
  accept,
  pickLabel,
  removeLabel,
  hasFile,
  onPick,
  onRemove,
}: {
  accept: string
  pickLabel: string
  removeLabel: string
  hasFile: boolean
  onPick: (file?: File) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-3 py-1.5 text-xs font-medium rounded-lg text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--text-muted)] transition-colors"
      >
        {pickLabel}
      </button>
      {hasFile && (
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-1.5 text-xs font-medium rounded-lg text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
        >
          {removeLabel}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          onPick(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}

function VolumeSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-[var(--text-secondary)]">{label}</span>
        <span className="text-xs font-medium text-[var(--text-primary)] tabular-nums">
          {Math.round(value * 100)}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--border-color)]"
        style={{ accentColor: '#ff6b6b' }}
      />
    </div>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-tomato-500' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export function SettingsPanel() {
  const { settings, language, updateSettings, setLanguage, bumpFilesVersion } = usePomodoroStore(
    (state) => ({
      settings: state.settings,
      language: state.language,
      updateSettings: state.updateSettings,
      setLanguage: state.setLanguage,
      bumpFilesVersion: state.bumpFilesVersion,
    })
  )
  const t = useTranslation()

  const [isOpen, setIsOpen] = useState(false)

  const { url: customImageUrl, hasFile: hasCustomImage } = useIndexedFile(FILE_KEYS.backgroundImage)
  const { hasFile: hasCustomVideo } = useIndexedFile(FILE_KEYS.backgroundVideo)
  const { hasFile: hasCustomBgm } = useIndexedFile(FILE_KEYS.bgm)
  const { url: customAlertUrl, hasFile: hasCustomAlert } = useIndexedFile(FILE_KEYS.reminderSound)

  const handleToggleNotifications = async () => {
    if (!settings.notificationEnabled) {
      const permission = await requestNotificationPermission()
      updateSettings({ notificationEnabled: permission === 'granted' })
    } else {
      updateSettings({ notificationEnabled: false })
    }
  }

  const handlePickFile = async (key: FileKey, file?: File) => {
    if (!file) return
    try {
      await saveFile(key, file)
      bumpFilesVersion()
    } catch {
      /* IndexedDB 写入失败时静默忽略 */
    }
  }

  const handleRemoveFile = async (key: FileKey) => {
    try {
      await deleteFile(key)
      bumpFilesVersion()
    } catch {
      /* ignore */
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

  const BACKGROUND_TYPES: { value: BackgroundType; label: string }[] = [
    { value: 'none', label: t.settings.backgroundNone },
    { value: 'image', label: t.settings.backgroundImage },
    { value: 'video', label: t.settings.backgroundVideo },
  ]

  const ALERT_TYPES: { value: AlertSoundSource; label: string }[] = [
    { value: 'default', label: t.settings.alertDefault },
    { value: 'custom', label: t.settings.alertCustom },
  ]

  const previewAlert = () => {
    if (customAlertUrl) {
      const audio = new Audio(customAlertUrl)
      audio.volume = 0.8
      void audio.play().catch(() => {})
    }
  }

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
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--border-color)]"
                style={{ accentColor: '#ff6b6b' }}
              />
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-[var(--text-secondary)]">{t.settings.sound}</span>
            <Toggle
              checked={settings.soundEnabled}
              onChange={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">{t.settings.notifications}</span>
            <Toggle
              checked={settings.notificationEnabled}
              onChange={handleToggleNotifications}
            />
          </div>

          {/* 背景设置 */}
          <div className="pt-3 border-t border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">{t.settings.background}</span>
              <div className="inline-flex p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                {BACKGROUND_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateSettings({ backgroundType: type.value })}
                    className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                      settings.backgroundType === type.value
                        ? 'text-white bg-gradient-tomato shadow-md shadow-tomato-500/25'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {settings.backgroundType === 'video' && (
              <div className="space-y-3 pl-0">
                <p className="text-xs text-[var(--text-muted)]">{t.settings.videoVolumeHint}</p>
                <VolumeSlider
                  label={t.settings.backgroundVideoVolume}
                  value={settings.backgroundVideoVolume}
                  onChange={(v) => updateSettings({ backgroundVideoVolume: v })}
                />
                <FilePicker
                  accept="video/*"
                  pickLabel={t.settings.uploadVideo}
                  removeLabel={t.settings.removeFile}
                  hasFile={hasCustomVideo}
                  onPick={(f) => handlePickFile(FILE_KEYS.backgroundVideo, f)}
                  onRemove={() => handleRemoveFile(FILE_KEYS.backgroundVideo)}
                />
              </div>
            )}

            {settings.backgroundType === 'image' && (
              <div className="space-y-3">
                {customImageUrl && (
                  <img
                    src={customImageUrl}
                    alt=""
                    className="w-full h-32 object-cover rounded-xl border border-[var(--border-color)]"
                  />
                )}
                <FilePicker
                  accept="image/*"
                  pickLabel={t.settings.uploadImage}
                  removeLabel={t.settings.removeFile}
                  hasFile={hasCustomImage}
                  onPick={(f) => handlePickFile(FILE_KEYS.backgroundImage, f)}
                  onRemove={() => handleRemoveFile(FILE_KEYS.backgroundImage)}
                />
              </div>
            )}
          </div>

          {/* BGM 设置 */}
          <div className="pt-3 border-t border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">{t.settings.bgm}</span>
              <Toggle
                checked={settings.bgmEnabled}
                onChange={() => updateSettings({ bgmEnabled: !settings.bgmEnabled })}
              />
            </div>

            {settings.bgmEnabled && (
              <>
                <VolumeSlider
                  label={t.settings.bgmVolume}
                  value={settings.bgmVolume}
                  onChange={(v) => updateSettings({ bgmVolume: v })}
                />
                <FilePicker
                  accept="audio/*"
                  pickLabel={t.settings.uploadBgm}
                  removeLabel={t.settings.removeFile}
                  hasFile={hasCustomBgm}
                  onPick={(f) => handlePickFile(FILE_KEYS.bgm, f)}
                  onRemove={() => handleRemoveFile(FILE_KEYS.bgm)}
                />
              </>
            )}
          </div>

          {/* 提醒音设置 */}
          <div className="pt-3 border-t border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">{t.settings.alertSound}</span>
              <div className="inline-flex p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                {ALERT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateSettings({ alertSound: type.value })}
                    className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                      settings.alertSound === type.value
                        ? 'text-white bg-gradient-tomato shadow-md shadow-tomato-500/25'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {settings.alertSound === 'custom' && (
              <div className="flex flex-wrap items-center gap-2">
                <FilePicker
                  accept="audio/*"
                  pickLabel={t.settings.uploadAlert}
                  removeLabel={t.settings.removeFile}
                  hasFile={hasCustomAlert}
                  onPick={(f) => handlePickFile(FILE_KEYS.reminderSound, f)}
                  onRemove={() => handleRemoveFile(FILE_KEYS.reminderSound)}
                />
                {customAlertUrl && (
                  <button
                    type="button"
                    onClick={previewAlert}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-gradient-tomato shadow-md shadow-tomato-500/25 hover:opacity-90 transition-opacity"
                  >
                    {t.settings.preview}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
