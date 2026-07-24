'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiGithub, FiFolder } from 'react-icons/fi'
import { Project } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useParallax } from '@/hooks/useParallax'

interface Props {
  project: Project
  onSelect: (project: Project) => void
}

export function ProjectCard({ project, onSelect }: Props) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLButtonElement>(null!)
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
    <motion.button
      ref={ref}
      onClick={() => onSelect(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); mx.set(0.5); my.set(0.5) }}
      onMouseMove={handleMove}
      className="group relative flex-1 min-w-[220px] max-w-[300px] rounded-2xl text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--surface-border)',
        ...parallaxStyle,
      }}
      animate={{
        y: hovered ? -8 : 0,
        scale: hovered ? 1.02 : 1,
        borderColor: hovered ? 'var(--accent)' : 'var(--surface-border)',
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl -z-10"
        style={{
          background: hovered
            ? `radial-gradient(150% 100% at ${mx.get() * 100}% ${my.get() * 100}%, var(--accent-soft) 0%, transparent 100%)`
            : 'transparent',
        }}
      />

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiFolder className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <h3 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
              {project.name}
            </h3>
          </div>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.p
              className="text-xs leading-relaxed mb-3"
              style={{ color: 'var(--text-secondary)' }}
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
              className="px-2 py-0.5 text-[10px] rounded-md"
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: 'var(--text-muted)',
                border: '1px solid var(--surface-border)',
              }}
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--surface-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <FiExternalLink className="w-3 h-3" />
            Live Demo
          </a>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--surface-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <FiGithub className="w-3 h-3" />
            Source
          </a>
        </motion.div>
      </div>
    </motion.button>
  )
}
