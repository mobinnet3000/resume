'use client'

import { useEffect, useCallback, useRef } from 'react'

interface Callbacks {
  onScrollDown?: () => void
  onScrollUp?: () => void
}

export function useScrollIntercept({ onScrollDown, onScrollUp }: Callbacks) {
  const ticking = useRef(false)

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      if (ticking.current) return
      ticking.current = true

      requestAnimationFrame(() => {
        if (e.deltaY > 0) {
          onScrollDown?.()
        } else {
          onScrollUp?.()
        }
        ticking.current = false
      })
    },
    [onScrollDown, onScrollUp]
  )

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [handleWheel])
}
