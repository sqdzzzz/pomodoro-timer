import type { AlertSoundSource } from '@/types'

/** 预设提醒音（网络热梗音效） */
export const PRESET_ALERT_SOUNDS: Partial<Record<AlertSoundSource, string>> = {
  nailong: `${import.meta.env.BASE_URL}audio/nailong-laugh.mp3`,
  gugugaga: `${import.meta.env.BASE_URL}audio/gugugaga.m4a`,
}

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (Ctx) {
      audioCtx = new Ctx()
    }
  }
  return audioCtx
}

/** 播放提醒音；传入 src（自定义音频 objectURL）时播放该音频，否则播放内置提示音；volume 0-1 */
export function playNotificationSound(src?: string | null, volume = 0.8): void {
  const v = Math.min(1, Math.max(0, volume))
  if (src) {
    const audio = new Audio(src)
    audio.volume = v
    void audio.play().catch(() => {
      /* 自动播放被拦截时静默忽略 */
    })
    return
  }

  const ctx = getAudioContext()
  if (!ctx) return

  const t = ctx.currentTime
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(880, t)
  oscillator.frequency.exponentialRampToValueAtTime(440, t + 0.5)

  gain.gain.setValueAtTime(0.15 * v, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)

  oscillator.start(t)
  oscillator.stop(t + 0.5)
}
