import { useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { formatTime } from '@/utils/formatTime'
import type { TimerMode } from '@/types'

export function useDocumentTitle(timeLeft: number, mode: TimerMode, isRunning: boolean): void {
  const t = useTranslation()

  useEffect(() => {
    const modeLabel = t.timerLabels[mode]
    document.title = isRunning
      ? `${formatTime(timeLeft)} · ${modeLabel}`
      : `${formatTime(timeLeft)} · ${modeLabel} (${t.documentTitle.paused})`
  }, [timeLeft, mode, isRunning, t])
}
