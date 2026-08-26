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

export function playNotificationSound(): void {
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

  gain.gain.setValueAtTime(0.15, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)

  oscillator.start(t)
  oscillator.stop(t + 0.5)
}
