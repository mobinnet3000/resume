'use client'

import { useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TECH_STACK } from '@/constants'

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function TechPills() {
  const ref = useRef<HTMLDivElement>(null!)

  const pills = useMemo(
    () =>
      TECH_STACK.map((tech, i) => ({
        tech,
        delay: i * 0.1,
      })),
    []
  )

  return (
    <div ref={ref} className="flex flex-wrap gap-2 mt-6 justify-center max-w-xl mx-auto">
      {pills.map(({ tech, delay }) => (
        <motion.span
          key={tech}
          className="px-3 py-1.5 text-xs rounded-full
                     border border-white/[0.06] bg-white/[0.02]
                     text-gray-500 cursor-default select-none
                     hover:border-[var(--theme-primary)]/30 hover:text-[var(--theme-primary)]/80
                     transition-colors duration-300"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 + delay }}
          whileHover={{ scale: 1.1, y: -3 }}
        >
          {tech}
        </motion.span>
      ))}
    </div>
  )
}
