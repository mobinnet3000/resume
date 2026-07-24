'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function Avatar({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null!)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })
  const [hovered, setHovered] = useState(false)

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current || reduce) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.15)
    y.set((e.clientY - cy) * 0.15)
  }

  const handleLeave = () => {
    x.set(0); y.set(0); setHovered(false)
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      className="relative w-28 h-28 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      style={{ x: springX, y: springY }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      aria-label="About Me"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(135deg, var(--theme-primary, #3b82f6), var(--theme-secondary, #8b5cf6))',
          padding: 2,
        }}
      >
        <div className="w-full h-full rounded-full bg-[#090909] flex items-center justify-center overflow-hidden">
          <span className="text-4xl select-none">😀</span>
        </div>
      </div>

      <motion.div
        className="absolute inset-0 rounded-full -z-10"
        animate={{
          boxShadow: hovered
            ? '0 0 40px var(--theme-glow, rgba(59,130,246,0.3)), 0 0 80px var(--theme-glow, rgba(139,92,246,0.15))'
            : '0 0 20px var(--theme-glow, rgba(59,130,246,0.1))',
        }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        className="absolute -inset-1 rounded-full -z-10 opacity-50"
        animate={{
          background: hovered
            ? 'conic-gradient(from var(--angle), var(--theme-primary, #3b82f6), var(--theme-secondary, #8b5cf6), var(--theme-tertiary, #06b6d4), var(--theme-primary, #3b82f6))'
            : 'conic-gradient(from var(--angle), transparent, transparent)',
        }}
        style={{
          background: 'conic-gradient(from var(--angle), var(--theme-primary, #3b82f6), var(--theme-secondary, #8b5cf6), var(--theme-tertiary, #06b6d4), var(--theme-primary, #3b82f6))',
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </motion.button>
  )
}
