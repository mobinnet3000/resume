'use client'

import { useEffect, useCallback, useRef } from 'react'

export function useEasterEggs(
  onOpenCommand: () => void,
  onSudoHire: () => void,
  onWhoami: () => void
) {
  const bufferRef = useRef('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        onOpenCommand()
        return
      }

      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault()
        document.dispatchEvent(new CustomEvent('space:pulse'))
        return
      }

      bufferRef.current += e.key.toLowerCase()

      if (bufferRef.current.includes('sudo hire mobin')) {
        bufferRef.current = ''
        onSudoHire()
      }

      if (bufferRef.current.includes('whoami')) {
        bufferRef.current = ''
        onWhoami()
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        bufferRef.current = ''
      }, 2000)
    },
    [onOpenCommand, onSudoHire, onWhoami]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [handleKey])
}
