import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { useTranslation } from '@/hooks/useTranslation'
import { useIndexedFile } from '@/hooks/useIndexedFile'
import { FILE_KEYS } from '@/utils/db'

const DEFAULT_VIDEO = `${import.meta.env.BASE_URL}backgrounds/default.mp4`
const DEFAULT_BGM = `${import.meta.env.BASE_URL}audio/default-bgm.m4a`

/**
 * 背景层：默认视频背景 / 自定义图片背景 / 自定义视频背景，以及 BGM 播放。
 * 视频背景默认 muted 自动播放（浏览器自动播放策略），拖动音量条即解除静音。
 * 视频背景可通过右下角悬浮按钮或设置面板暂停。
 */
export function BackgroundLayer() {
  const backgroundType = usePomodoroStore((s) => s.settings.backgroundType)
  const videoVolume = usePomodoroStore((s) => s.settings.backgroundVideoVolume)
  const videoPaused = usePomodoroStore((s) => s.settings.backgroundVideoPaused)
  const bgmEnabled = usePomodoroStore((s) => s.settings.bgmEnabled)
  const bgmVolume = usePomodoroStore((s) => s.settings.bgmVolume)
  const updateSettings = usePomodoroStore((s) => s.updateSettings)

  const t = useTranslation()

  const { url: customVideoUrl } = useIndexedFile(
    backgroundType === 'video' ? FILE_KEYS.backgroundVideo : null
  )
  const { url: customImageUrl } = useIndexedFile(
    backgroundType === 'image' ? FILE_KEYS.backgroundImage : null
  )
  const { url: customBgmUrl } = useIndexedFile(bgmEnabled ? FILE_KEYS.bgm : null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const bgmRef = useRef<HTMLAudioElement>(null)

  const videoSrc = customVideoUrl || DEFAULT_VIDEO
  const bgmSrc = customBgmUrl || DEFAULT_BGM

  // 背景视频音量：0 → 保持静音自动播放；>0 → 解除静音（暂停状态下不主动恢复播放）
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (videoVolume > 0) {
      v.muted = false
      v.volume = videoVolume
      if (!videoPaused) v.play().catch(() => {})
    } else {
      v.muted = true
      v.volume = 0
    }
  }, [videoVolume, videoSrc, backgroundType, videoPaused])

  // 背景视频暂停/恢复：设置变化、切换视频源后均保持一致
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (videoPaused) {
      v.pause()
    } else {
      v.play().catch(() => {})
    }
  }, [videoPaused, videoSrc, backgroundType])

  // BGM：开关控制播放，音量实时生效
  useEffect(() => {
    const a = bgmRef.current
    if (!a) return
    a.volume = bgmVolume
    if (bgmEnabled) {
      a.play().catch(() => {})
    } else {
      a.pause()
    }
  }, [bgmEnabled, bgmVolume, bgmSrc])

  if (backgroundType === 'none' && !bgmEnabled) {
    return null
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {backgroundType === 'video' && (
          <video
            key={videoSrc}
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            onClick={() => {
              // 点击背景视频：解除静音并恢复播放，同时同步暂停状态
              const v = videoRef.current
              if (!v) return
              if (videoPaused) updateSettings({ backgroundVideoPaused: false })
              v.muted = false
              v.volume = Math.max(videoVolume, 0.5)
              v.play().catch(() => {})
            }}
          />
        )}
        {backgroundType === 'image' && customImageUrl && (
          <img src={customImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        {/* 遮罩层：保证前景内容可读 */}
        <div className="absolute inset-0 bg-slate-900/40" />
        {bgmEnabled && <audio ref={bgmRef} src={bgmSrc} loop preload="auto" />}
      </div>

      {/* 背景视频暂停/恢复悬浮按钮：不随 UI 透明度隐藏，低透明度提示、悬停时清晰 */}
      {backgroundType === 'video' && (
        <button
          type="button"
          onClick={() => updateSettings({ backgroundVideoPaused: !videoPaused })}
          title={videoPaused ? t.settings.playBackgroundVideo : t.settings.pauseBackgroundVideo}
          aria-label={videoPaused ? t.settings.playBackgroundVideo : t.settings.pauseBackgroundVideo}
          className="fixed bottom-4 right-4 z-30 w-9 h-9 rounded-full glass flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-110 opacity-60 hover:opacity-100 transition-all duration-200"
        >
          {videoPaused ? (
            // 播放图标（当前已暂停，点击恢复）
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          ) : (
            // 暂停图标（当前播放中，点击暂停）
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
            </svg>
          )}
        </button>
      )}
    </>
  )
}
