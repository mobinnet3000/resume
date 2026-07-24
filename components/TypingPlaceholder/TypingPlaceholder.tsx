'use client'

import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'

const DEFAULT_MSGS = [
  { text: 'AI Platform — Real-time inference engine', href: '#' },
  { text: 'FlutterFlow — Cross-platform app builder', href: '#' },
  { text: 'DevOps Dashboard — Infra monitoring', href: '#' },
]

const TYPE_SPEED = 60
const DELETE_SPEED = 30
const PAUSE_AFTER_TYPE = 2000
const PAUSE_AFTER_DELETE = 500

export interface TypingHandle { next: () => void }

interface Props { messages?: { text: string; href: string }[] }

export const TypingPlaceholder = forwardRef<TypingHandle, Props>(function TypingPlaceholder({ messages = DEFAULT_MSGS }, ref) {
  const [text, setText] = useState('')
  const [href, setHref] = useState('#')
  const stateRef = useRef({ msgIdx: 0, charIdx: 0, isDeleting: false, paused: false })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateDisplay = useCallback((msgIdx: number, charIdx: number) => {
    const msg = messages[msgIdx % messages.length]
    setText(msg.text.slice(0, charIdx))
    setHref(msg.href)
  }, [messages])

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }, [])

  const tick = useCallback(() => {
    const st = stateRef.current
    if (st.paused) return
    const msg = messages[st.msgIdx % messages.length]
    if (st.isDeleting) {
      if (st.charIdx === 0) {
        st.isDeleting = false; st.msgIdx = (st.msgIdx + 1) % messages.length
        timerRef.current = setTimeout(tick, PAUSE_AFTER_DELETE); return
      }
      st.charIdx--; updateDisplay(st.msgIdx, st.charIdx)
      timerRef.current = setTimeout(tick, DELETE_SPEED)
    } else {
      if (st.charIdx >= msg.text.length) {
        st.isDeleting = true; timerRef.current = setTimeout(tick, PAUSE_AFTER_TYPE); return
      }
      st.charIdx++; updateDisplay(st.msgIdx, st.charIdx)
      timerRef.current = setTimeout(tick, TYPE_SPEED)
    }
  }, [updateDisplay, messages])

  useImperativeHandle(ref, () => ({
    next: () => {
      const st = stateRef.current
      st.msgIdx = (st.msgIdx + 1) % messages.length
      st.charIdx = messages[st.msgIdx].text.length
      st.isDeleting = true; st.paused = false
      updateDisplay(st.msgIdx, st.charIdx); stopTimer()
      timerRef.current = setTimeout(() => { stateRef.current.paused = false; tick() }, 2500)
    },
  }), [tick, updateDisplay, stopTimer, messages])

  useEffect(() => {
    stopTimer(); timerRef.current = setTimeout(tick, TYPE_SPEED)
    return stopTimer
  }, [tick, stopTimer])

  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={(e) => { stateRef.current.paused = true; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.boxShadow = '0 0 24px var(--accent-soft)'; e.currentTarget.style.backgroundColor = '#1a1a24' }}
      onMouseLeave={(e) => { stateRef.current.paused = false; tick(); e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = 'var(--surface)' }}
      style={{ height: 48, padding: '0 16px', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-secondary)', backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: 10, textAlign: 'left', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', cursor: 'pointer', outline: 'none', flex: 1, display: 'block', lineHeight: '48px', textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s, background-color 0.2s' }}
    >
      {text || '\u00A0'}
    </a>
  )
})
