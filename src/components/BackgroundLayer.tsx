import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { useIndexedFile } from '@/hooks/useIndexedFile'
import { FILE_KEYS } from '@/utils/db'

const DEFAULT_VIDEO = `${import.meta.env.BASE_URL}backgrounds/default.mp4`
const DEFAULT_BGM = `${import.meta.env.BASE_URL}audio/default-bgm.m4a`

/**
 * 背景层：默认视频背景 / 自定义图片背景 / 自定义视频背景，以及 BGM 播放。
 * 视频背景默认 muted 自动播放（浏览器自动播放策略），拖动音量条即解除静音。
 */
export function BackgroundLayer() {
  const backgroundType = usePomodoroStore((s) => s.settings.backgroundType)
  const videoVolume = usePomodoroStore((s) => s.settings.backgroundVideoVolume)
  const bgmEnabled = usePomodoroStore((s) => s.settings.bgmEnabled)
  const bgmVolume = usePomodoroStore((s) => s.settings.bgmVolume)

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

  // 背景视频音量：0 → 保持静音自动播放；>0 → 解除静音并尝试恢复播放
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (videoVolume > 0) {
      v.muted = false
      v.volume = videoVolume
      v.play().catch(() => {})
    } else {
      v.muted = true
      v.volume = 0
    }
  }, [videoVolume, videoSrc, backgroundType])

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
            const v = videoRef.current
            if (!v) return
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
  )
}
