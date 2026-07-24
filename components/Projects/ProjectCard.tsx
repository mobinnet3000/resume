'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { FiExternalLink, FiGithub } from 'react-icons/fi'
import { Project } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Props {
  project: Project
}

export function ProjectCard({ project }: Props) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null!)
  const reduce = useReducedMotion()
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const springMx = useSpring(mx, { stiffness: 200, damping: 20 })
  const springMy = useSpring(my, { stiffness: 200, damping: 20 })

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current || reduce) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <motion.a
      ref={ref}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); mx.set(0.5); my.set(0.5) }}
      onMouseMove={handleMove}
      className="group relative flex-1 min-w-[220px] max-w-[300px] p-5 rounded-2xl
                 border border-white/[0.06] bg-white/[0.02]
                 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
      style={{
        perspective: '800px',
      }}
      animate={{
        y: hovered ? -8 : 0,
        scale: hovered ? 1.02 : 1,
        borderColor: hovered ? 'var(--theme-primary)' : 'rgba(255,255,255,0.06)',
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl -z-10"
        style={{
          background: hovered
            ? `radial-gradient(150% 100% at ${springMx.get() * 100}% ${springMy.get() * 100}%, var(--theme-glow, rgba(59,130,246,0.08)) 0%, transparent 100%)`
            : 'transparent',
        }}
      />

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white tracking-wide">
          {project.name}
        </h3>
        <motion.div
          className="flex gap-2"
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 8 }}
          transition={{ duration: 0.2 }}
        >
          <FiGithub className="w-3.5 h-3.5 text-gray-500 hover:text-[var(--theme-primary)] transition-colors" />
          <FiExternalLink className="w-3.5 h-3.5 text-gray-500 hover:text-[var(--theme-primary)] transition-colors" />
        </motion.div>
      </div>

      <motion.p
        className="text-xs text-gray-500 leading-relaxed line-clamp-2"
        animate={{
          opacity: hovered ? 1 : 0.6,
        }}
        transition={{ duration: 0.2 }}
      >
        {project.description}
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-1.5 mt-3"
        animate={{ y: hovered ? 0 : 4 }}
        transition={{ duration: 0.2 }}
      >
        {project.tech.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 text-[10px] rounded-md
                       bg-white/[0.04] text-gray-500 border border-white/[0.06]
                       group-hover:border-[var(--theme-primary)]/20 group-hover:text-[var(--theme-primary)]/70
                       transition-colors duration-300"
          >
            {t}
          </span>
        ))}
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)]/40 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={hovered ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
        style={{ originX: 0.5 }}
      />
    </motion.a>
  )
}
