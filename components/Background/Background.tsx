'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SimpleParticles } from './SimpleParticles'

export function Background() {
  const reduce = useReducedMotion()

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[#040404]" />
      {!reduce && <SimpleParticles />}
    </>
  )
}
