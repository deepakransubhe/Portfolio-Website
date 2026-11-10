import { useState } from 'react'
import ShaderBackdrop from './ShaderBackdrop'
import { timeline, background } from '../data/content'

function FlipDigit({ value }) {
  return (
    <span className="xp-digit" style={{ display: 'inline-block', letterSpacing: '-0.075em' }}>
      {value}
    </span>
  )
}

function YearDisplay({ year }) {
  const str = String(year)
  return (
    <div className="xp-year" aria-label={str}>
      {str.split('').map((ch, i) => <FlipDigit key={i} value={ch} />)}
    </div>
  )
}

export default function AboutView() {
  const [active, setActive] = useState(timeline.length - 1)
  const entry = timeline[active]

  // Parse year from string like "2020-2024"
  const year = entry.when.split('-')[0]

  const minYear = parseInt(timeline[0].when.split('-')[0]) || 2014
  const maxYear = 2026
  const entryStart = parseInt(entry.when.split('-')[0]) || 2024
  const t = (entryStart - minYear) / Math.max(1, maxYear - minYear)

  const prev = () => setActive(a => Math.max(0, a - 1))
  const next = () => setActive(a => Math.min(timeline.length - 1, a + 1))

  // Build ticks
  const ticks = []
  for (let y = minYear; y <= maxYear; y++) {
    const isMajor = y % 5 === 0
    const frac = (y - minYear) / (maxYear - minYear)
    ticks.push({ year: y, frac, isMajor, isPast: y < entryStart })
  }

  return (
    <div className="about-view xp" role="region" aria-label="Experience">
      <ShaderBackdrop />

      {/* Main stage */}
      <div className="xp-stage">
        <YearDisplay year={year} />
        <div className="xp-post">
          <p className="xp-when">{entry.when} · {entry.where}</p>
          <h2>
            {entry.title.split(' ').map((word, i) => (
              <span key={i} className="xp-word">
                <span style={{ animationDelay: `${i * 0.06}s` }}>{word}</span>
              </span>
            ))}
          </h2>
          <p className="xp-role">{entry.role}</p>
          <p className="xp-note">{entry.note}</p>
          <ul className="xp-highlights">
            {entry.highlights.map((h, i) => (
              <li key={i} style={{ animationDelay: `${0.3 + i * 0.08}s` }}>{h}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Nav buttons */}
      <div className="xp-steps">
        <button className="xp-step" onClick={prev} aria-label="Previous" aria-disabled={active === 0}>
          <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button className="xp-step" onClick={next} aria-label="Next" aria-disabled={active === timeline.length - 1}>
          <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>

      {/* Timeline ruler */}
      <div className="xp-ruler" style={{ '--xp-t': t }}>
        <div className="xp-ticks">
          {ticks.map(({ year, frac, isMajor, isPast }) => (
            <div
              key={year}
              className={`xp-tick${isMajor ? ' is-major' : ''}${isPast ? ' is-past' : ''}`}
              style={{ left: `${frac * 100}%` }}
            >
              {isMajor && <i>{year}</i>}
            </div>
          ))}
        </div>
        <div className="xp-line">
          <div className="xp-lit" />
        </div>

        {/* Posts (timeline entries) */}
        <div className="xp-posts">
          {timeline.map((item, i) => {
            const start = parseInt(item.when.split('-')[0]) || minYear
            const end = item.when.includes('Present') ? maxYear : (parseInt(item.when.split('-')[1]) || start + 1)
            const left = `${((start - minYear) / (maxYear - minYear)) * 100}%`
            const width = `${Math.max(4, ((end - start) / (maxYear - minYear)) * 100)}%`
            return (
              <li key={i} style={{ left, width }}>
                <button
                  className={`${i === active ? 'is-on' : ''}`}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  style={{ '--c': item.color || 'var(--board-ink)' }}
                >
                  <span className="xp-bar" />
                  <span className="xp-name">{item.title}</span>
                </button>
              </li>
            )
          })}
        </div>

        {/* Playhead */}
        <div className="xp-head-mark" />
      </div>

      {/* Background section */}
      <div style={{
        position: 'absolute',
        bottom: 'calc(var(--hud-inset-y) + 7rem)',
        left: 'var(--pad-x, clamp(1.25rem, 4vw, 3.5rem))',
        fontSize: '0.72rem',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--board-ink-3)',
        display: 'flex',
        gap: '2rem',
      }}>
        <span>{background.citizenshipsLabel}: <strong style={{ color: 'var(--board-ink-2)', fontWeight: 500 }}>{background.citizenships}</strong></span>
        <span>{background.languagesLabel}: <strong style={{ color: 'var(--board-ink-2)', fontWeight: 500 }}>{background.languages}</strong></span>
      </div>
    </div>
  )
}
