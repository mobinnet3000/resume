'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LOADING_COMMANDS } from '@/constants'

interface Props {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: Props) {
  const [lines, setLines] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const [show, setShow] = useState(true)
  const indexRef = useRef(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => { mountedRef.current = false }
  }, [])

  const addLine = useCallback((text: string) => {
    if (!mountedRef.current) return
    setLines((prev) => [...prev, text])
  }, [])

  useEffect(() => {
    let isCancelled = false
    const run = async () => {
      for (const cmd of LOADING_COMMANDS) {
        if (isCancelled) return
        await new Promise((resolve) => setTimeout(resolve, cmd.delay))
        if (isCancelled) return
        addLine(`> ${cmd.text}`)
        indexRef.current++
      }
      if (!isCancelled) {
        setDone(true)
        await new Promise((resolve) => setTimeout(resolve, 600))
        if (!isCancelled) {
          setShow(false)
          setTimeout(onComplete, 500)
        }
      }
    }
    run()
    return () => { isCancelled = true }
  }, [addLine, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#040404] flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-[420px] max-w-[90vw]">
            <div className="border border-white/[0.06] rounded-2xl bg-white/[0.02] p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                <span className="text-xs text-gray-600 ml-2 font-mono">terminal</span>
              </div>

              <div className="font-mono text-xs leading-relaxed">
                {lines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${
                      line.includes('Ready') ? 'text-green-400' : 'text-gray-400'
                    }`}
                  >
                    {line}
                  </motion.div>
                ))}
                {!done && (
                  <motion.span
                    className="text-gray-400 inline-block"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                )}
                {done && (
                  <motion.div
                    className="text-green-400 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {'>'} System ready. Launching portfolio...
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
