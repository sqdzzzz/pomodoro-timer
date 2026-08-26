import { usePomodoroStore } from '@/store/pomodoroStore'
import { translations, type TranslationDict } from '@/i18n'

export function useTranslation(): TranslationDict {
  const language = usePomodoroStore((state) => state.language)
  return translations[language]
}
