import { useEffect, useRef, useState } from 'react'

export default function BootLoader({ phase }) {
  const [pct, setPct] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (phase === 'load') {
      startRef.current = performance.now()
      function tick() {
        const elapsed = performance.now() - startRef.current
        const p = Math.min(elapsed / 1800, 1)
        setPct(Math.round(p * 100))
        if (p < 1) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(rafRef.current)
    }
  }, [phase])

  if (phase === 'live' || phase === 'expand') return null

  const r = 22
  const circ = 2 * Math.PI * r
  const dash = circ * (pct / 100)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div className="pl-ring">
        <svg viewBox="0 0 50 50">
          <circle className="pl-ring-track" cx="25" cy="25" r={r} />
          <circle
            className="pl-ring-arc"
            cx="25" cy="25" r={r}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={0}
          />
        </svg>
        <span className="pl-pct" aria-live="polite">{pct}</span>
      </div>
    </div>
  )
}
