'use client'

import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'resume-admin'

const CREDENTIALS = { username: 'admin', password: 'mobin1379' }

export interface AdminData {
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

const DEFAULT_DATA: AdminData = {
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

export function checkAuth(user: string, pass: string): boolean {
  return user === CREDENTIALS.username && pass === CREDENTIALS.password
}

export function loadData(): AdminData {
  if (typeof window === 'undefined') return DEFAULT_DATA
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_DATA, ...parsed, socialLinks: parsed.socialLinks || DEFAULT_DATA.socialLinks, messages: parsed.messages || DEFAULT_DATA.messages, roleTexts: parsed.roleTexts || DEFAULT_DATA.roleTexts }
    }
  } catch {}
  return DEFAULT_DATA
}

export function saveData(data: AdminData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function useAdmin() {
  const [data, setData] = useState<AdminData>(DEFAULT_DATA)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setData(loadData())
    setLoaded(true)
  }, [])

  const update = useCallback((patch: Partial<AdminData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch }
      saveData(next)
      return next
    })
  }, [])

  const updateSocialLink = useCallback((index: number, url: string) => {
    setData((prev) => {
      const links = [...prev.socialLinks]
      if (links[index]) links[index] = { ...links[index], url }
      const next = { ...prev, socialLinks: links }
      saveData(next)
      return next
    })
  }, [])

  const updateMessage = useCallback((index: number, text: string, href: string) => {
    setData((prev) => {
      const msgs = [...prev.messages]
      if (msgs[index]) msgs[index] = { text, href }
      const next = { ...prev, messages: msgs }
      saveData(next)
      return next
    })
  }, [])

  const updateRoleText = useCallback((index: number, text: string) => {
    setData((prev) => {
      const roles = [...prev.roleTexts]
      if (roles[index]) roles[index] = text
      const next = { ...prev, roleTexts: roles }
      saveData(next)
      return next
    })
  }, [])

  const addMessage = useCallback(() => {
    setData((prev) => {
      const next = { ...prev, messages: [...prev.messages, { text: 'New Project', href: '#' }] }
      saveData(next)
      return next
    })
  }, [])

  const removeMessage = useCallback((index: number) => {
    setData((prev) => {
      const msgs = prev.messages.filter((_, i) => i !== index)
      const next = { ...prev, messages: msgs }
      saveData(next)
      return next
    })
  }, [])

  return { data, loaded, update, updateSocialLink, updateMessage, updateRoleText, addMessage, removeMessage }
}
