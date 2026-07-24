'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiMonitor } from 'react-icons/fi'
import { useTheme } from '@/lib/theme-context'
import { useState, useRef, useEffect } from 'react'

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} className="fixed top-5 right-5 z-40">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-9 h-9 rounded-xl border border-white/[0.06] bg-white/[0.03] flex items-center justify-center
                   hover:border-[var(--theme-primary)]/30 transition-colors duration-300
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
        aria-label="Switch theme"
      >
        <FiMonitor className="w-4 h-4 text-gray-400" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-12 right-0 rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/95 backdrop-blur-xl p-2 min-w-[160px]"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors
                  ${theme.id === t.id ? 'bg-white/[0.06] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'}`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: t.primary }}
                />
                {t.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
