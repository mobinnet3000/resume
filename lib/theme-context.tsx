'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { ThemeId, ThemeConfig, THEMES } from '@/constants/theme'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ThemeCtx {
  theme: ThemeConfig
  setTheme: (id: ThemeId) => void
  themes: ThemeConfig[]
}

const ThemeContext = createContext<ThemeCtx>({
  theme: THEMES[0],
  setTheme: () => {},
  themes: THEMES,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeConfig>(THEMES[0])
  const reduce = useReducedMotion()

  const setTheme = useCallback(
    (id: ThemeId) => {
      const t = THEMES.find((th) => th.id === id) || THEMES[0]
      setThemeState(t)
      if (!reduce && typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--theme-primary', t.primary)
        document.documentElement.style.setProperty('--theme-secondary', t.secondary)
        document.documentElement.style.setProperty('--theme-tertiary', t.tertiary)
        document.documentElement.style.setProperty('--theme-glow', t.glow)
      }
    },
    [reduce]
  )

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--theme-primary', theme.primary)
    root.style.setProperty('--theme-secondary', theme.secondary)
    root.style.setProperty('--theme-tertiary', theme.tertiary)
    root.style.setProperty('--theme-glow', theme.glow)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
