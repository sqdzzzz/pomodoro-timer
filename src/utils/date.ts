import type { Language } from '@/i18n'
import { translations } from '@/i18n'

export function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function getLast7Days(): string[] {
  const days: string[] = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

export function getWeekdayLabel(dateStr: string, language: Language = 'zh'): string {
  const date = new Date(dateStr)
  return translations[language].weekdays[date.getDay()]
}
