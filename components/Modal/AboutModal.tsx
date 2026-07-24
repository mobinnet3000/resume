'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

interface Props {
  open: boolean
  onClose: () => void
}

export function AboutModal({ open, onClose }: Props) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleKey])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/90 backdrop-blur-xl p-8"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg p-1"
              aria-label="Close"
            >
              <FiX className="w-4 h-4" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">About Me</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {`I'm a passionate Full Stack Developer with expertise in building modern,
              scalable applications. I specialize in Next.js, Flutter, and AI engineering,
              creating seamless digital experiences that push boundaries.`}
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Location', 'Tehran, Iran'],
                ['Experience', '5+ Years'],
                ['Focus', 'Full Stack'],
                ['Status', 'Available'],
              ].map(([label, value]) => (
                <div key={label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-gray-600 text-xs">{label}</div>
                  <div className="text-gray-300 font-medium mt-0.5">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
