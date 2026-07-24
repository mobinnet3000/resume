'use client'

import { useState, useEffect } from 'react'

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReduced(mq.matches)
    const handle = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [])

  return prefersReduced ?? false
}
