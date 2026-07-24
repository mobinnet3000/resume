'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
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
      className="relative w-[100px] h-[100px] rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{ x: springX, y: springY }}
      initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      aria-label="About Me"
    >
      <div className="w-full h-full rounded-full bg-[var(--surface)] flex items-center justify-center overflow-hidden border-2 border-transparent relative">
        <Image src="/avatar.png" alt="Mobin Bastai" width={100} height={100} className="w-full h-full object-cover" />
      </div>
      <motion.div
        className="absolute -inset-[3px] rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={hovered ? { opacity: 1, scale: 1.15 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ border: '2px solid var(--accent)' }}
      />
    </motion.button>
  )
}
