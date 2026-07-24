'use client'

import { useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TECH_STACK } from '@/constants'

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
          className="px-3 py-1.5 text-xs rounded-full cursor-default select-none transition-colors duration-300"
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: 'var(--text-muted)',
            border: '1px solid var(--surface-border)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 + delay }}
          whileHover={{
            scale: 1.08,
            y: -2,
            borderColor: 'var(--accent)',
            color: 'var(--accent)',
          }}
        >
          {tech}
        </motion.span>
      ))}
    </div>
  )
}
