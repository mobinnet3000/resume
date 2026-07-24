'use client'

import { Background } from '@/components/Background/Background'
import { Cursor } from '@/components/Cursor/Cursor'
import { Avatar } from '@/components/Avatar/Avatar'
import { Name } from '@/components/Name/Name'
import { TypingAnimation } from '@/components/Subtitle/TypingAnimation'
import { SocialButtons } from '@/components/Social/SocialButtons'
import { CodeLines } from '@/components/CodeLines/CodeLines'
import { TypingPlaceholder } from '@/components/TypingPlaceholder/TypingPlaceholder'
import { FiTerminal } from 'react-icons/fi'

export default function Home() {
  return (
    <>
      <Background />
      <Cursor />

      <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden select-none" style={{ padding: '48px 24px' }}>
        <div className="flex flex-col items-center text-center w-full max-w-[380px]">
          <p
            className="flex items-center gap-2 mb-4 text-xs tracking-wider"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'lowercase' }}
          >
            <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: 'var(--syntax-string)', boxShadow: '0 0 10px 1px var(--syntax-string)' }} />
            available
          </p>

          <div className="flex flex-col items-center gap-4 w-full mb-8">
            <Avatar onClick={() => {}} />
            <Name />
            <TypingAnimation />
          </div>

          <div className="w-full p-6 rounded-2xl" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border)', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.4), 0 8px 16px -8px rgba(0,0,0,0.25)' }}>
            <CodeLines />
            <div className="flex gap-2 mt-4">
              <TypingPlaceholder />
              <button type="button" className="w-[48px] h-[48px] rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', border: 'none', cursor: 'pointer' }} aria-label="Next message">
                <FiTerminal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <SocialButtons />
        </div>
      </section>
    </>
  )
}
