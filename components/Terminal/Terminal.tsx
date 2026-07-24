'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

interface Props {
  open: boolean
  onClose: () => void
}

const COMMANDS: Record<string, string> = {
  help: 'Available: about, projects, skills, github, linkedin, telegram, instagram, email, resume, theme, whoami, clear, exit',
  about: 'Mobin Bastai — Full Stack Developer. Building premium digital experiences.',
  projects: 'Check out my projects above or visit my GitHub.',
  skills: 'System Design, Cloud Architecture, CI/CD, Microservices, REST APIs, GraphQL, WebSockets, Kubernetes',
  github: 'Opening GitHub...',
  linkedin: 'Opening LinkedIn...',
  telegram: 'Opening Telegram...',
  instagram: 'Opening Instagram...',
  email: 'Opening email client...',
  resume: 'Opening resume...',
  whoami: 'Mobin Bastai\nFull Stack Developer\nOpen Source Enthusiast',
  'sudo hire mobin': '✅ Access granted. Welcome aboard, developer.',
}

export function Terminal({ open, onClose }: Props) {
  const [lines, setLines] = useState<string[]>([
    'Welcome to Mobin\'s terminal. Type "help" to begin.',
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null!)
  const endRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLines(['Welcome to Mobin\'s terminal. Type "help" to begin.'])
    }
  }, [open])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const cmd = input.trim().toLowerCase()
    if (!cmd) return

    setLines((prev) => [...prev, `$ ${cmd}`])
    setHistory((prev) => [...prev, cmd])
    setHistoryIdx(-1)
    setInput('')

    if (cmd === 'clear') {
      setLines([])
      return
    }

    if (cmd === 'exit') {
      onClose()
      return
    }

    const response = COMMANDS[cmd]
    if (response) {
      setLines((prev) => [...prev, response])
      if (cmd === 'github' || cmd === 'linkedin' || cmd === 'telegram' ||
          cmd === 'instagram' || cmd === 'email' || cmd === 'resume') {
        window.open('#', '_blank')
      }
    } else {
      setLines((prev) => [...prev, `Unknown command: ${cmd}. Type "help" for available commands.`])
    }
  }, [input, onClose])

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1)
        setHistoryIdx(idx)
        setInput(history[idx])
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx !== -1) {
        const idx = historyIdx + 1
        if (idx >= history.length) {
          setHistoryIdx(-1)
          setInput('')
        } else {
          setHistoryIdx(idx)
          setInput(history[idx])
        }
      }
    }
  }, [history, historyIdx])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/95 backdrop-blur-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              <span className="text-xs text-gray-600 ml-2 font-mono">terminal</span>
              <button
                onClick={onClose}
                className="ml-auto text-gray-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded p-0.5"
                aria-label="Close terminal"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 font-mono text-sm max-h-[60vh] overflow-y-auto">
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={`whitespace-pre-wrap ${
                    line.startsWith('$') ? 'text-green-400' :
                    line.includes('✅') ? 'text-green-400' :
                    line.startsWith('Unknown') ? 'text-red-400' :
                    'text-gray-400'
                  }`}
                >
                  {line}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 pb-4">
              <span className="text-green-400 font-mono text-sm">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                className="flex-1 bg-transparent text-sm text-white font-mono outline-none placeholder-gray-700"
                placeholder="Type a command..."
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
