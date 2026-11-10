import React, { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HudFrame from './components/HudFrame'
import PageDock from './components/PageDock'
import ShaderBackdrop from './components/ShaderBackdrop'
import WorkView from './components/WorkView'
import AboutView from './components/AboutView'
import ContactView from './components/ContactView'
import BootLoader from './components/BootLoader'
import './styles/app.css'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [view, setView] = useState('work')
  const [phase, setPhase] = useState('load') // load → clear → shape → drop → expand → live
  const [booted, setBooted] = useState(false)
  const lenisRef = useRef(null)

  useEffect(() => {
    // Boot sequence
    const tl = gsap.timeline()
    tl.to({}, { duration: 0.5, onComplete: () => setPhase('clear') })
      .to({}, { duration: 0.5, onComplete: () => setPhase('shape') })
      .to({}, { duration: 0.5, onComplete: () => setPhase('drop') })
      .to({}, { duration: 0.5, onComplete: () => setPhase('expand') })
      .to({}, { duration: 0.6, onComplete: () => { setPhase('live'); setBooted(true) } })
  }, [])

  useEffect(() => {
    if (!booted) return
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    lenisRef.current = lenis
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [booted])

  return (
    <div className={`page-body${!booted ? ' is-booting' : ''}`} data-theme="dark">
      <ShaderBackdrop fixed />
      <HudFrame view={view} onNavigate={setView} />
      <PageDock view={view} phase={phase} onChange={setView} />
      {!booted && <BootLoader phase={phase} />}
      <main className="page-main">
        {view === 'work' && <WorkView />}
        {view === 'about' && <AboutView />}
        {view === 'contact' && <ContactView />}
      </main>
    </div>
  )
}
