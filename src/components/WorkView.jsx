import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import ShaderBackdrop from './ShaderBackdrop'
import { caseStudies } from '../data/content'

function ProjectCard({ project, isActive, index }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    if (isActive) {
      gsap.to(ref.current, { opacity: 1, duration: 0.6, ease: 'power2.out' })
    } else {
      gsap.to(ref.current, { opacity: 0, duration: 0.4, ease: 'power2.in' })
    }
  }, [isActive])

  const bg = project.img
    ? { backgroundImage: `url(${project.img})` }
    : { background: `radial-gradient(ellipse at 30% 70%, ${project.accent}44, #0e0e12)` }

  return (
    <article
      ref={ref}
      className={`project-card${isActive ? ' is-active' : ''}`}
      aria-hidden={!isActive}
    >
      <div className="project-bg" style={bg} />
      <div className="project-info">
        <div className="project-tags">
          {project.tags.map(t => (
            <span key={t} className="project-tag">{t}</span>
          ))}
          <span className="project-tag">{project.year}</span>
        </div>
        <h2 className="project-title" style={{ '--accent': project.accent }}>
          {project.title}
        </h2>
        <p className="project-desc">{project.desc}</p>
        <button className="project-cta">
          View case study
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 17 10-10M7 7h10v10"/>
          </svg>
        </button>
      </div>
    </article>
  )
}

export default function WorkView() {
  const [active, setActive] = useState(0)
  const containerRef = useRef(null)
  const touchStartRef = useRef(null)

  const prev = () => setActive(a => (a - 1 + caseStudies.length) % caseStudies.length)
  const next = () => setActive(a => (a + 1) % caseStudies.length)

  // Keyboard navigation
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Touch swipe
  const onTouchStart = e => { touchStartRef.current = e.touches[0].clientX }
  const onTouchEnd = e => {
    if (touchStartRef.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartRef.current
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev()
    touchStartRef.current = null
  }

  return (
    <div
      className="work-view"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <ShaderBackdrop />
      <div className="project-showcase" aria-label="Selected work">
        {caseStudies.map((project, i) => (
          <ProjectCard key={project.slug} project={project} isActive={i === active} index={i} />
        ))}
      </div>

      {/* Nav arrows */}
      <div className="project-nav">
        <button
          className="project-nav-btn"
          onClick={prev}
          aria-label="Previous project"
          aria-disabled={active === 0}
        >
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button
          className="project-nav-btn"
          onClick={next}
          aria-label="Next project"
          aria-disabled={active === caseStudies.length - 1}
        >
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="project-dots" role="tablist" aria-label="Projects">
        {caseStudies.map((p, i) => (
          <button
            key={p.slug}
            role="tab"
            aria-selected={i === active}
            aria-label={p.title}
            className={`project-dot${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            style={{ '--accent': p.accent }}
          />
        ))}
      </div>
    </div>
  )
}
