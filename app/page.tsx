'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Background } from '@/components/Background/Background'
import { Cursor } from '@/components/Cursor/Cursor'
import { Avatar } from '@/components/Avatar/Avatar'
import { Name } from '@/components/Name/Name'
import { TypingAnimation } from '@/components/Subtitle/TypingAnimation'
import { SocialButtons } from '@/components/Social/SocialButtons'
import { CodeLines } from '@/components/CodeLines/CodeLines'
import { TypingPlaceholder, TypingHandle } from '@/components/TypingPlaceholder/TypingPlaceholder'
import { AdminPanel } from '@/components/AdminPanel/AdminPanel'
import { AdminProvider, useAdminData } from '@/lib/admin-context'
import { FiTerminal } from 'react-icons/fi'

function HomePage() {
  const typingRef = useRef<TypingHandle>(null!)
  const [adminOpen, setAdminOpen] = useState(false)
  const [time, setTime] = useState('')
  const { data } = useAdminData()
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleDotClick = useCallback(() => {
    clickCountRef.current++
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      setAdminOpen((p) => !p)
    } else {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0 }, 1000)
    }
  }, [])

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: data.timezone }))
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [data.timezone])



  return (
    <>
      <Background />
      <Cursor />
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />

      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }} />

      <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden select-none" style={{ padding: '32px 24px' }}>
        <div className="flex flex-col items-center text-center w-full max-w-[400px]">
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'lowercase', cursor: 'pointer' }}
            onClick={handleDotClick}
          >
            <div style={{ position: 'relative', width: 8, height: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--syntax-string)', boxShadow: '0 0 12px var(--syntax-string)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            </div>
            <span>{data.availableText}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', marginBottom: 32 }}>
            <Avatar onClick={() => {}} />
            <Name firstNameColor={data.firstNameColor} lastNameColor={data.lastNameColor} />
            <TypingAnimation texts={data.roleTexts} />
          </div>

          <div style={{
            width: '100%', padding: 24, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--surface), rgba(18,18,25,0.95))',
            border: '1px solid var(--surface-border)',
            boxShadow: '0 24px 48px -16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-50%', left: '50%', width: '60%', height: '60%', background: 'radial-gradient(ellipse, var(--accent-soft) 0%, transparent 70%)', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <CodeLines />
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <TypingPlaceholder ref={typingRef} messages={data.messages} />
                <button
                  type="button"
                  onClick={() => typingRef.current?.next()}
                  aria-label="Next message"
                  style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'linear-gradient(135deg, var(--accent), #e67c18)',
                    color: 'var(--bg)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(247,139,28,0.3)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 30px var(--accent)'; e.currentTarget.style.transform = 'scale(1.1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(247,139,28,0.3)'; e.currentTarget.style.transform = 'scale(1)' }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)' }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.1)' }}
                >
                  <FiTerminal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <SocialButtons links={data.socialLinks} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            <span>{data.location}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'var(--surface-border)' }} />
            <span>{time} {data.timezone.split('/').pop()}</span>
          </div>
        </div>
      </section>

      <style>{`@keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }`}</style>
    </>
  )
}

export default function Home() {
  return (
    <AdminProvider>
      <HomePage />
    </AdminProvider>
  )
}
