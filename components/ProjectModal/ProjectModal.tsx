'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiExternalLink, FiGithub, FiFolder } from 'react-icons/fi'
import { Project } from '@/types'

interface Props {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: Props) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (project) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [project, handleKey])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/95 backdrop-blur-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          >
            <div className="relative h-48 bg-gradient-to-br from-[var(--theme-primary)]/10 to-[var(--theme-secondary)]/10 flex items-center justify-center border-b border-white/[0.06]">
              <FiFolder className="w-16 h-16 text-[var(--theme-primary)]/30" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center
                           text-gray-400 hover:text-white hover:bg-white/[0.1] transition-colors
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
                aria-label="Close"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">{project.name}</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-5">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 text-xs rounded-lg bg-white/[0.04] text-gray-400 border border-white/[0.06]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                             bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border border-[var(--theme-primary)]/20
                             hover:bg-[var(--theme-primary)]/20 transition-all duration-200"
                >
                  <FiExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                             bg-white/[0.04] text-gray-400 border border-white/[0.06]
                             hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                >
                  <FiGithub className="w-4 h-4" />
                  Source
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
