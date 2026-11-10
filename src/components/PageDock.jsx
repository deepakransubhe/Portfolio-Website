import { useRef, useLayoutEffect } from 'react'

const ICONS = {
  work: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="5" height="5" rx="1.15"/>
      <rect x="9.5" y="3" width="5" height="5" rx="1.15"/>
      <rect x="16" y="3" width="5" height="5" rx="1.15"/>
      <rect x="3" y="9.5" width="5" height="5" rx="1.15"/>
      <rect x="9.5" y="9.5" width="5" height="5" rx="1.15"/>
      <rect x="16" y="9.5" width="5" height="5" rx="1.15"/>
      <rect x="3" y="16" width="5" height="5" rx="1.15"/>
      <rect x="9.5" y="16" width="5" height="5" rx="1.15"/>
      <rect x="16" y="16" width="5" height="5" rx="1.15"/>
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M6 2.7h8.05L19.5 8.15V20.1a1.45 1.45 0 0 1-1.45 1.45H6A1.45 1.45 0 0 1 4.55 20.1V4.15A1.45 1.45 0 0 1 6 2.7zm7.55 1.65v4.2h4.15l-4.15-4.2zM7.35 12.2h9.3v1.35h-9.3zm0 3.15h6.4v1.35h-6.4z"/>
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="5.2" cy="12" r="2.15"/>
      <circle cx="12" cy="12" r="2.15"/>
      <circle cx="18.8" cy="12" r="2.15"/>
    </svg>
  ),
}

const NAV = [
  { id: 'work',    label: 'Work' },
  { id: 'about',   label: 'Experience' },
  { id: 'contact', label: 'More' },
]

export default function PageDock({ view, phase, onChange }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (phase === 'live' || phase === 'load' || phase === 'clear') {
      el.style.width = ''
      return
    }
    if (phase === 'drop') return
    const cur = el.getBoundingClientRect().width
    el.style.width = 'max-content'
    const full = el.offsetWidth
    el.style.width = `${cur}px`
    el.offsetWidth // force reflow
    const raf = requestAnimationFrame(() => { el.style.width = `${full}px` })
    return () => cancelAnimationFrame(raf)
  }, [phase])

  return (
    <nav className={`page-dock is-${phase}`} aria-label="Pages">
      <div className="page-dock-glass" ref={ref}>
        <span className="page-dock-meter" aria-hidden="true" />
        {NAV.map(item => (
          <button
            key={item.id}
            type="button"
            className="page-dock-item"
            aria-current={view === item.id ? 'page' : undefined}
            aria-label={item.label}
            onClick={() => onChange(item.id)}
          >
            <span className="page-dock-icon">{ICONS[item.id]}</span>
            <span className="page-dock-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
