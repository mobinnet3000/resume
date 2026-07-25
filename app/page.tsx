'use client'

import { useRef, useState, useEffect } from 'react'
import { Background } from '@/components/Background/Background'
import { Cursor } from '@/components/Cursor/Cursor'
import { Avatar } from '@/components/Avatar/Avatar'
import { Name } from '@/components/Name/Name'
import { TypingAnimation } from '@/components/Subtitle/TypingAnimation'
import { SocialButtons } from '@/components/Social/SocialButtons'
import { CodeLines } from '@/components/CodeLines/CodeLines'
import { TypingPlaceholder, TypingHandle } from '@/components/TypingPlaceholder/TypingPlaceholder'
import { FiTerminal } from 'react-icons/fi'

interface Config {
  name: string
  firstNameColor: string
  lastNameColor: string
  availableText: string
  roleTexts: string[]
  location: string
  timezone: string
  socialLinks: { name: string; url: string }[]
  messages: { text: string; href: string }[]
}

const DEFAULT: Config = {
  name: 'Mobin Bastai',
  firstNameColor: '#f78b1c',
  lastNameColor: '#f4ce23',
  availableText: 'available for freelance',
  roleTexts: ['Full Stack Developer', 'Flutter Developer', 'AI Engineer', 'Backend Developer', 'Open Source Enthusiast'],
  location: 'Tehran, Iran',
  timezone: 'Asia/Tehran',
  socialLinks: [
    { name: 'GitHub', url: '#' },
    { name: 'LinkedIn', url: '#' },
    { name: 'Telegram', url: '#' },
    { name: 'Instagram', url: '#' },
    { name: 'Email', url: '#' },
    { name: 'Resume', url: '#' },
  ],
  messages: [
    { text: 'AI Platform — Real-time inference engine', href: '#' },
    { text: 'FlutterFlow — Cross-platform app builder', href: '#' },
    { text: 'DevOps Dashboard — Infra monitoring', href: '#' },
  ],
}

async function fetchConfig(): Promise<Config> {
  try {
    const res = await fetch('/config.json?t=' + Date.now())
    if (res.ok) return await res.json()
  } catch {}
  return DEFAULT
}

export default function Home() {
  const typingRef = useRef<TypingHandle>(null!)
  const [cfg, setCfg] = useState<Config>(DEFAULT)
  const [time, setTime] = useState('')

  useEffect(() => { fetchConfig().then(setCfg) }, [])

  // Dynamic page title — typewriter "Mobin Bastani"
  useEffect(() => {
    const text = 'Mobin Bastani'
    let idx = 0
    let deleting = false
    document.title = '|'
    const timer = setInterval(() => {
      if (!deleting) {
        idx++
        document.title = text.slice(0, idx) + '|'
        if (idx >= text.length) { deleting = true; idx = text.length }
      } else {
        idx--
        document.title = text.slice(0, idx) + '|'
        if (idx <= 0) { deleting = false; idx = 0 }
      }
    }, 200)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: cfg.timezone }))
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [cfg.timezone])

  return (
    <>
      <Background />
      <Cursor />

      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }} />

      <section className="relative z-10 min-h-dvh flex items-center justify-center overflow-hidden select-none px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col items-center text-center w-full max-w-[360px] md:max-w-[400px]">
          <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-5 font-mono text-[10px] md:text-xs tracking-wider" style={{ color: 'var(--text-secondary)', textTransform: 'lowercase' }}>
            <div className="w-[6px] h-[6px] md:w-[8px] md:h-[8px] rounded-full" style={{ backgroundColor: 'var(--syntax-string)', boxShadow: '0 0 10px var(--syntax-string)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span>{cfg.availableText}</span>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-4 w-full mb-5 md:mb-8">
            <Avatar onClick={() => {}} />
            <Name firstNameColor={cfg.firstNameColor} lastNameColor={cfg.lastNameColor} />
            <TypingAnimation texts={cfg.roleTexts} />
          </div>

          <div className="w-full p-3 md:p-6 rounded-2xl" style={{
            background: 'linear-gradient(135deg, var(--surface), rgba(18,18,25,0.95))',
            border: '1px solid var(--surface-border)',
            boxShadow: '0 24px 48px -16px rgba(0,0,0,0.5)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div className="absolute top-[-50%] left-1/2 w-3/5 h-3/5 -translate-x-1/2 pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--accent-soft) 0%, transparent 70%)' }} />
            <div className="relative z-[1]">
              <CodeLines />
              <div className="flex gap-2 mt-3 md:mt-4">
                <TypingPlaceholder ref={typingRef} messages={cfg.messages} />
                <button type="button" onClick={() => typingRef.current?.next()} aria-label="Next message"
                  className="w-[44px] h-[44px] md:w-[48px] md:h-[48px] rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, var(--accent), #e67c18)', color: 'var(--bg)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(247,139,28,0.3)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 30px var(--accent)'; e.currentTarget.style.transform = 'scale(1.1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(247,139,28,0.3)'; e.currentTarget.style.transform = 'scale(1)' }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)' }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.1)' }}
                >
                  <FiTerminal className="w-[18px] h-[18px] md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>

          <SocialButtons links={cfg.socialLinks} />

          <div className="flex items-center gap-2 md:gap-3 mt-4 md:mt-6 text-[10px] md:text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            <span>{cfg.location}</span>
            <span className="w-[2px] h-[2px] md:w-[3px] md:h-[3px] rounded-full" style={{ backgroundColor: 'var(--surface-border)' }} />
            <span>{time} {cfg.timezone.split('/').pop()}</span>
          </div>
        </div>
      </section>

      <style>{`@keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }`}</style>
    </>
  )
}
