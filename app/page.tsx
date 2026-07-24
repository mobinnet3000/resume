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

export default function Home() {
  const typingRef = useRef<TypingHandle>(null!)
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran' }))
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <Background />
      <Cursor />

      {/* Scan line overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }} />

      <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden select-none" style={{ padding: '32px 24px' }}>
        <div className="flex flex-col items-center text-center w-full max-w-[400px]">

          {/* Available badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'lowercase' }}>
            <div style={{ position: 'relative', width: 8, height: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--syntax-string)', boxShadow: '0 0 12px var(--syntax-string)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            </div>
            <span>available for freelance</span>
          </div>

          {/* Avatar + Name + Role */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', marginBottom: 32 }}>
            <Avatar onClick={() => {}} />
            <Name />
            <TypingAnimation />
          </div>

          {/* Code Card */}
          <div style={{
            width: '100%',
            padding: 24,
            borderRadius: 16,
            background: 'linear-gradient(135deg, var(--surface), rgba(18,18,25,0.95))',
            border: '1px solid var(--surface-border)',
            boxShadow: '0 24px 48px -16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Subtle accent glow */}
            <div style={{ position: 'absolute', top: '-50%', left: '50%', width: '60%', height: '60%', background: 'radial-gradient(ellipse, var(--accent-soft) 0%, transparent 70%)', transform: 'translateX(-50%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <CodeLines />
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <TypingPlaceholder ref={typingRef} />
                <button
                  type="button"
                  onClick={() => typingRef.current?.next()}
                  aria-label="Next message"
                  style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'linear-gradient(135deg, var(--accent), #e67c18)',
                    color: 'var(--bg)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 16px rgba(247,139,28,0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px var(--accent)'
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(247,139,28,0.3)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)' }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.1)' }}
                >
                  <FiTerminal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <SocialButtons />

          {/* Status line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            <span>Tehran, Iran</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'var(--surface-border)' }} />
            <span>{time} IRST</span>
          </div>

        </div>
      </section>

      <style>{`
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
      `}</style>
    </>
  )
}
