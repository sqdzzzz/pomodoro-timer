import type { Theme } from '@/hooks/useTheme'
import { useTranslation } from '@/hooks/useTranslation'

interface ThemeToggleProps {
  theme: Theme
  toggle: () => void
}

export function ThemeToggle({ theme, toggle }: ThemeToggleProps) {
  const t = useTranslation()

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-xl transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
      aria-label={theme === 'light' ? t.theme.toDark : t.theme.toLight}
      title={theme === 'light' ? t.theme.toDark : t.theme.toLight}
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  )
}
