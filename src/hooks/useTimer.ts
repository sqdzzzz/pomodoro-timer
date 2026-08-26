import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/store/pomodoroStore'

export function useTimer(): void {
  const { isRunning, timeLeft, tick, complete } = usePomodoroStore((state) => ({
    isRunning: state.isRunning,
    timeLeft: state.timeLeft,
    tick: state.tick,
    complete: state.complete,
  }))

  const completeRef = useRef(complete)
  completeRef.current = complete

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, tick])

  useEffect(() => {
    if (timeLeft <= 0 && isRunning) {
      completeRef.current()
    }
  }, [timeLeft, isRunning])
}
