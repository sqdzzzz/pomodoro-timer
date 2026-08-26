import { useEffect } from 'react'
import { formatTime } from '@/utils/formatTime'

export function useDocumentTitle(timeLeft: number, mode: string, isRunning: boolean): void {
  useEffect(() => {
    const modeLabel = mode === 'work' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'
    document.title = `${formatTime(timeLeft)} · ${modeLabel}${isRunning ? '' : ' (paused)'}`
  }, [timeLeft, mode, isRunning])
}
