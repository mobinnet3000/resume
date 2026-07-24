'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTerminal, FiGithub, FiLinkedin, FiMail, FiFileText, FiSearch } from 'react-icons/fi'
import { PROJECTS, TECH_STACK, SOCIAL_LINKS } from '@/constants'

interface Props {
  open: boolean
  onClose: () => void
  onOpenAbout: () => void
}

interface CommandItem {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
}

export function CommandPalette({ open, onClose, onOpenAbout }: Props) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null!)

  const allItems = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [
      { id: 'about', label: 'about', description: 'Open about modal', icon: FiTerminal, action: () => { onOpenAbout(); onClose() } },
      { id: 'projects', label: 'projects', description: 'View projects', icon: FiSearch, action: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); onClose() } },
      ...SOCIAL_LINKS.map((l) => ({
        id: l.name.toLowerCase(), label: l.name.toLowerCase(), description: `Open ${l.name}`, icon: l.name === 'GitHub' ? FiGithub : l.name === 'LinkedIn' ? FiLinkedin : l.name === 'Email' ? FiMail : l.name === 'Resume' ? FiFileText : FiTerminal,
        action: () => { window.open(l.url, '_blank'); onClose() },
      })),
      ...PROJECTS.map((p) => ({
        id: `project-${p.id}`, label: p.name.toLowerCase(), description: p.description, icon: FiSearch,
        action: () => { window.open(p.url, '_blank'); onClose() },
      })),
      ...TECH_STACK.map((t) => ({
        id: `tech-${t.toLowerCase()}`, label: t.toLowerCase(), description: `Technology: ${t}`, icon: FiTerminal,
        action: () => onClose(),
      })),
    ]
    return items
  }, [onOpenAbout, onClose])

  const filtered = useMemo(
    () => allItems.filter((item) => item.label.includes(query.toLowerCase())),
    [allItems, query]
  )

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveIndex(0)
    }
  }, [open])

  const execute = useCallback(
    (item: CommandItem) => {
      item.action()
    },
    []
  )

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((p) => (p + 1) % filtered.length) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((p) => (p - 1 + filtered.length) % filtered.length) }
      if (e.key === 'Enter' && filtered[activeIndex]) execute(filtered[activeIndex])
    },
    [open, filtered, activeIndex, execute, onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setActiveIndex(0) }, [query])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/95 backdrop-blur-xl overflow-hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <FiSearch className="w-4 h-4 text-blue-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, projects, technologies..."
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
              />
              <kbd className="text-[10px] text-gray-600 border border-white/[0.06] rounded px-1.5 py-0.5">ESC</kbd>
            </div>

            <div className="py-2 max-h-[300px] overflow-y-auto">
              {filtered.map((item, i) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => execute(item)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                      ${i === activeIndex ? 'bg-white/[0.06] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{item.label}</span>
                    <span className="text-xs text-gray-600 ml-auto truncate max-w-[200px]">{item.description}</span>
                  </button>
                )
              })}
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-gray-600">No results found</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
