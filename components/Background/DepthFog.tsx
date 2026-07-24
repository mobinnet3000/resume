'use client'

export function DepthFog() {
  return (
    <div
      className="fixed inset-0 -z-6 pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, rgba(6, 182, 212, 0.02) 0%, transparent 40%)
        `,
      }}
    />
  )
}
