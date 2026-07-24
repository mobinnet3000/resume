'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Background } from '@/components/Background/Background'
import { Avatar } from '@/components/Avatar/Avatar'
import { Name } from '@/components/Name/Name'
import { TypingAnimation } from '@/components/Subtitle/TypingAnimation'
import { SocialButtons } from '@/components/Social/SocialButtons'
import { Projects } from '@/components/Projects/Projects'
import { TechPills } from '@/components/TechStack/TechPills'
import { SkillTags } from '@/components/Skills/SkillTags'
import { StatusBar } from '@/components/Status/StatusBar'
import { AboutModal } from '@/components/Modal/AboutModal'
import { useScrollIntercept } from '@/hooks/useScrollIntercept'
import { useEasterEggs } from '@/hooks/useEasterEggs'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const LoadingScreen = dynamic(
  () => import('@/components/Loader/LoadingScreen').then((m) => ({ default: m.LoadingScreen })),
  { ssr: false }
)

const CustomCursor = dynamic(
  () => import('@/components/Cursor/CustomCursor').then((m) => ({ default: m.CustomCursor })),
  { ssr: false }
)

const Spotlight = dynamic(
  () => import('@/components/Spotlight/Spotlight').then((m) => ({ default: m.Spotlight })),
  { ssr: false }
)

const CommandPalette = dynamic(
  () => import('@/components/CommandPalette/CommandPalette').then((m) => ({ default: m.CommandPalette })),
  { ssr: false }
)

const Terminal = dynamic(
  () => import('@/components/Terminal/Terminal').then((m) => ({ default: m.Terminal })),
  { ssr: false }
)

function SudoToast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl
                 border border-green-500/20 bg-green-500/5 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <span className="text-green-400 font-mono text-sm">{message}</span>
    </motion.div>
  )
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [termOpen, setTermOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [pulseActive, setPulseActive] = useState(false)
  const reduce = useReducedMotion()

  const [scrollPhase, setScrollPhase] = useState(0)

  useScrollIntercept({
    onScrollDown: useCallback(() => {
      setScrollPhase((p) => Math.min(p + 1, 3))
      document.dispatchEvent(new CustomEvent('scroll:down'))
    }, []),
    onScrollUp: useCallback(() => {
      setScrollPhase((p) => Math.max(p - 1, 0))
      document.dispatchEvent(new CustomEvent('scroll:up'))
    }, []),
  })

  useEasterEggs(
    useCallback(() => setCmdOpen(true), []),
    useCallback(() => setToast('✅ Access granted. Welcome aboard, developer.'), []),
    useCallback(() => setToast('👤 Mobin Bastai — Full Stack Developer'), [])
  )

  useEffect(() => {
    const handleSpace = () => {
      setPulseActive(true)
      setTimeout(() => setPulseActive(false), 800)
    }

    const handleAbout = () => setAboutOpen(true)
    const handleTerminal = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault()
        setTermOpen((p) => !p)
      }
    }

    document.addEventListener('space:pulse', handleSpace)
    document.addEventListener('open:about', handleAbout)
    document.addEventListener('keydown', handleTerminal)

    return () => {
      document.removeEventListener('space:pulse', handleSpace)
      document.removeEventListener('open:about', handleAbout)
      document.removeEventListener('keydown', handleTerminal)
    }
  }, [])

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <Background />
      {!reduce && <CustomCursor />}
      <Spotlight />

      <AnimatePresence>
        {toast && <SudoToast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onOpenAbout={() => setAboutOpen(true)} />
      <Terminal open={termOpen} onClose={() => setTermOpen(false)} />

      <main
        className="relative z-10 w-full h-screen flex flex-col items-center justify-center overflow-hidden select-none"
        style={{
          transform: `scale(${1 - scrollPhase * 0.02})`,
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <motion.div
          className="flex flex-col items-center"
          animate={pulseActive ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.8 }}
        >
          <Avatar onClick={() => setAboutOpen(true)} />
          <Name />
          <TypingAnimation />
          <SocialButtons />
          <Projects />
          <TechPills />
          <SkillTags />
          <StatusBar />
        </motion.div>
      </main>
    </>
  )
}
