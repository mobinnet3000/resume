'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiGithub, FiFolder } from 'react-icons/fi'
import { Project } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useParallax } from '@/hooks/useParallax'

interface Props {
  project: Project
}

export function ProjectCard({ project }: Props) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null!)
  const reduce = useReducedMotion()
  const { style: parallaxStyle } = useParallax('cards')
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current || reduce) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); mx.set(0.5); my.set(0.5) }}
      onMouseMove={handleMove}
      className="group relative flex-1 min-w-[220px] max-w-[300px] rounded-2xl
                 border border-white/[0.06] bg-white/[0.02]
                 cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
      style={parallaxStyle}
      animate={{
        y: hovered ? -12 : 0,
        scale: hovered ? 1.03 : 1,
        borderColor: hovered ? 'var(--theme-primary)' : 'rgba(255,255,255,0.06)',
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl -z-10"
        style={{
          background: hovered
            ? `radial-gradient(150% 100% at ${mx.get() * 100}% ${my.get() * 100}%, var(--theme-glow, rgba(59,130,246,0.1)) 0%, transparent 100%)`
            : 'transparent',
        }}
      />

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiFolder className="w-4 h-4 text-[var(--theme-primary)]/60" />
            <h3 className="text-sm font-semibold text-white tracking-wide">{project.name}</h3>
          </div>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.p
              className="text-xs text-gray-400 leading-relaxed mb-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {project.description}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div
          className="flex flex-wrap gap-1.5"
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
          className="flex gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
                       bg-white/[0.04] text-gray-400 border border-white/[0.06]
                       hover:bg-[var(--theme-primary)]/10 hover:text-[var(--theme-primary)] hover:border-[var(--theme-primary)]/30
                       transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <FiExternalLink className="w-3 h-3" />
            Live Demo
          </a>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
                       bg-white/[0.04] text-gray-400 border border-white/[0.06]
                       hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15]
                       transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <FiGithub className="w-3 h-3" />
            Source
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)]/40 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={hovered ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
        style={{ originX: 0.5 }}
      />
    </motion.div>
  )
}
