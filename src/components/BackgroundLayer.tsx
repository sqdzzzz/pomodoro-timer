import { useEffect, useRef, useState } from 'react'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { useTranslation } from '@/hooks/useTranslation'
import { useIndexedFile } from '@/hooks/useIndexedFile'
import { FILE_KEYS } from '@/utils/db'

const DEFAULT_VIDEO = `${import.meta.env.BASE_URL}backgrounds/default.mp4`
const DEFAULT_BGM = `${import.meta.env.BASE_URL}audio/default-bgm.m4a`

/**
 * 背景层：默认视频背景 / 自定义图片背景 / 自定义视频背景，以及 BGM 播放。
 * 视频背景默认 muted 自动播放（浏览器自动播放策略），拖动音量条即解除静音。
 * 视频背景可通过右下角悬浮按钮或设置面板暂停；底部进度条支持点击/拖拽调整进度。
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

  // 进度条：用 ref 直接操作 DOM（rAF 每帧更新，避免整组件重渲染）
  const progressBarRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  // 暂停状态镜像到 ref：rAF 循环里读取最新值，避免闭包过期
  const videoPausedRef = useRef(videoPaused)
  videoPausedRef.current = videoPaused

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

  // 进度条同步：rAF 每帧直接写 DOM（比 timeupdate 更流畅、不触发 React 重渲染）
  useEffect(() => {
    if (backgroundType !== 'video') return
    let raf = 0
    const applyProgress = (ratio: number) => {
      const clamped = Math.min(1, Math.max(0, ratio))
      const pct = `${clamped * 100}%`
      if (fillRef.current) fillRef.current.style.width = pct
      if (handleRef.current) handleRef.current.style.left = pct
      progressBarRef.current?.setAttribute('aria-valuenow', String(Math.round(clamped * 100)))
    }
    const loop = () => {
      const v = videoRef.current
      // 拖拽中由 pointer 事件负责显示，避免与预览进度互相覆盖
      if (v && v.duration > 0 && !isDraggingRef.current) {
        applyProgress(v.currentTime / v.duration)
        // 看门狗：非用户主动暂停却被浏览器置为暂停（如 seek 触发的中断）时自动恢复播放
        if (!videoPausedRef.current && v.paused && v.readyState >= 2) {
          v.play().catch(() => {})
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [backgroundType, videoSrc])

  /** 根据指针事件在进度条上的横向位置计算 0-1 比例 */
  const ratioFromPointer = (e: React.PointerEvent): number | null => {
    const bar = progressBarRef.current
    if (!bar || bar.getBoundingClientRect().width === 0) return null
    const rect = bar.getBoundingClientRect()
    return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
  }

  const seekTo = (ratio: number) => {
    const v = videoRef.current
    if (!v || !v.duration || Number.isNaN(v.duration)) return
    v.currentTime = ratio * v.duration
    // 修复：seek 之后浏览器可能把视频留在暂停态，非用户暂停时强制恢复播放
    if (!videoPaused && v.paused) v.play().catch(() => {})
    if (fillRef.current) fillRef.current.style.width = `${ratio * 100}%`
    if (handleRef.current) handleRef.current.style.left = `${ratio * 100}%`
  }

  const handleProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const ratio = ratioFromPointer(e)
    if (ratio === null) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    isDraggingRef.current = true
    setIsDragging(true)
    seekTo(ratio)
  }

  const handleProgressPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    const ratio = ratioFromPointer(e)
    if (ratio !== null) seekTo(ratio)
  }

  const handleProgressPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  // 键盘微调：←/→ ±5%，Home/End 跳到首尾
  const handleProgressKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const v = videoRef.current
    if (!v || !v.duration || Number.isNaN(v.duration)) return
    const step = v.duration * 0.05
    let ratio: number | null = null
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') ratio = Math.max(0, v.currentTime - step) / v.duration
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') ratio = Math.min(v.duration, v.currentTime + step) / v.duration
    else if (e.key === 'Home') ratio = 0
    else if (e.key === 'End') ratio = 1
    if (ratio === null) return
    e.preventDefault()
    seekTo(ratio)
  }

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

      {/* 背景视频暂停/恢复悬浮按钮：上移避开底部进度条的点击区（旧位置与进度条拖拽区重叠，拖到右侧会误触暂停） */}
      {backgroundType === 'video' && (
        <button
          type="button"
          onClick={() => updateSettings({ backgroundVideoPaused: !videoPaused })}
          title={videoPaused ? t.settings.playBackgroundVideo : t.settings.pauseBackgroundVideo}
          aria-label={videoPaused ? t.settings.playBackgroundVideo : t.settings.pauseBackgroundVideo}
          className="fixed bottom-10 right-4 z-40 w-9 h-9 rounded-full glass flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-110 opacity-60 hover:opacity-100 transition-all duration-200"
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

      {/* 背景视频进度条：屏幕底部全宽，悬停/拖拽时视觉增强，支持点击跳转与拖拽 */}
      {backgroundType === 'video' && (
        <div
          ref={progressBarRef}
          role="slider"
          tabIndex={0}
          aria-label={t.settings.backgroundVideoProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          title={t.settings.backgroundVideoProgress}
          onPointerDown={handleProgressPointerDown}
          onPointerMove={handleProgressPointerMove}
          onPointerUp={handleProgressPointerUp}
          onPointerCancel={handleProgressPointerUp}
          onKeyDown={handleProgressKeyDown}
          className="group fixed bottom-0 left-0 right-0 z-30 h-6 flex items-end cursor-pointer touch-none"
        >
          <div
            className={`relative w-full rounded-full transition-[height] duration-150 ${
              isDragging ? 'h-1.5' : 'h-1 group-hover:h-1.5'
            }`}
          >
            {/* 底轨 */}
            <div className="absolute inset-0 rounded-full bg-white/25" />
            {/* 已播放 */}
            <div
              ref={fillRef}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-tomato shadow-[0_0_8px_rgba(255,107,107,0.55)]"
              style={{ width: '0%' }}
            />
            {/* 拖拽手柄 */}
            <div
              ref={handleRef}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md ring-2 ring-tomato-500/60 transition-opacity ${
                isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{ left: '0%' }}
            />
          </div>
        </div>
      )}
    </>
  )
}
