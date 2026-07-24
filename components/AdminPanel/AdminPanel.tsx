'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiLock, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi'
import { checkAuth, useAdmin } from '@/lib/admin-store'

interface Props {
  open: boolean
  onClose: () => void
}

export function AdminPanel({ open, onClose }: Props) {
  const { data, update, updateSocialLink, updateMessage, updateRoleText, addMessage, removeMessage } = useAdmin()
  const [authed, setAuthed] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'social' | 'messages' | 'roles' | 'general'>('general')

  const handleLogin = () => {
    if (checkAuth(username, password)) {
      setAuthed(true)
      setError('')
    } else {
      setError('Invalid credentials')
    }
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border)' }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                {authed ? '⚡ Admin Panel' : '🔒 Admin Access'}
              </h2>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--text-muted)' }} aria-label="Close">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {!authed ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', border: '1px solid var(--surface-border)' }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', border: '1px solid var(--surface-border)' }}
                />
                {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
                <button
                  onClick={handleLogin}
                  className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
                >
                  <FiLock className="w-4 h-4" /> Unlock
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Tabs */}
                <div className="flex gap-2 flex-wrap">
                  {(['general', 'social', 'messages', 'roles'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: tab === t ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                        color: tab === t ? 'var(--bg)' : 'var(--text-secondary)',
                      }}
                    >
                      {t === 'general' ? 'General' : t === 'social' ? 'Social Links' : t === 'messages' ? 'Messages' : 'Role Texts'}
                    </button>
                  ))}
                </div>

                {tab === 'general' && (
                  <div className="space-y-4">
                    <Field label="Available Text" value={data.availableText} onChange={(v) => update({ availableText: v })} />
                    <Field label="Location" value={data.location} onChange={(v) => update({ location: v })} />
                    <Field label="Timezone" value={data.timezone} onChange={(v) => update({ timezone: v })} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="First Name Color" value={data.firstNameColor} onChange={(v) => update({ firstNameColor: v })} />
                      <Field label="Last Name Color" value={data.lastNameColor} onChange={(v) => update({ lastNameColor: v })} />
                    </div>
                  </div>
                )}

                {tab === 'social' && (
                  <div className="space-y-3">
                    {data.socialLinks.map((link, i) => (
                      <div key={link.name} className="flex items-center gap-2">
                        <span className="text-xs w-20 shrink-0" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{link.name}</span>
                        <input
                          value={link.url}
                          onChange={(e) => updateSocialLink(i, e.target.value)}
                          className="flex-1 h-9 px-3 rounded-lg text-xs outline-none"
                          style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', border: '1px solid var(--surface-border)' }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'messages' && (
                  <div className="space-y-3">
                    {data.messages.map((msg, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          value={msg.text}
                          onChange={(e) => updateMessage(i, e.target.value, msg.href)}
                          placeholder="Text"
                          className="flex-1 h-9 px-3 rounded-lg text-xs outline-none"
                          style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', border: '1px solid var(--surface-border)' }}
                        />
                        <input
                          value={msg.href}
                          onChange={(e) => updateMessage(i, msg.text, e.target.value)}
                          placeholder="URL"
                          className="w-28 h-9 px-3 rounded-lg text-xs outline-none"
                          style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', border: '1px solid var(--surface-border)' }}
                        />
                        <button onClick={() => removeMessage(i)} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ color: '#ef4444' }}>
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button onClick={addMessage} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--accent)' }}>
                      <FiPlus className="w-3.5 h-3.5" /> Add Message
                    </button>
                  </div>
                )}

                {tab === 'roles' && (
                  <div className="space-y-3">
                    {data.roleTexts.map((text, i) => (
                      <Field key={i} label={`Title ${i + 1}`} value={text} onChange={(v) => updateRoleText(i, v)} />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--surface-border)' }}>
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all" style={{ backgroundColor: saved ? 'var(--syntax-string)' : 'var(--accent)', color: 'var(--bg)' }}>
                    <FiSave className="w-3.5 h-3.5" /> {saved ? 'Changes auto-saved ✓' : 'Save'}
                  </button>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Changes saved to localStorage</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-4 rounded-xl text-sm outline-none"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', border: '1px solid var(--surface-border)' }}
      />
    </div>
  )
}
