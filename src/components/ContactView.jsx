import { useState } from 'react'
import ShaderBackdrop from './ShaderBackdrop'
import { person, socials, ui } from '../data/content'

const SocialIcon = ({ icon }) => {
  const paths = {
    linkedin: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45Z',
    github:   'M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z',
    twitter:  'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    dribbble: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 1.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 0 0-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0 1 12 3.475zm-3.633.803a53.896 53.896 0 0 1 3.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 0 1 4.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 0 1-2.19-5.705zM12 20.547a8.482 8.482 0 0 1-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 0 1 1.823 6.475 8.4 8.4 0 0 1-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 0 1-3.655 5.715z',
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="currentColor">
      <path d={paths[icon] || ''} />
    </svg>
  )
}

export default function ContactView() {
  const [theme, setTheme] = useState('dark')

  const toggleTheme = t => {
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
  }

  return (
    <div className="contact-view cb">
      <ShaderBackdrop />
      <div className="cb-board">
        {/* Left slab - actions */}
        <div className="cb-slab cb-slab--actions">
          <div className="cb-handle"/><div className="cb-handle"/>
          <div className="cb-handle"/><div className="cb-handle"/>

          <div className="cb-head">
            <h2 className="cb-title">{ui.footer.kicker}</h2>
          </div>

          <a href={`mailto:${person.email}`} className="cb-mail">
            <span className="cb-kicker">Email</span>
            <span className="cb-address">{person.email}</span>
          </a>

          <ul className="cb-rows">
            <li>
              <a href={`mailto:${person.email}`}>
                <div className="cb-row-text">
                  <span className="cb-row-label">Send a message</span>
                  <span className="cb-row-sub">{person.email}</span>
                </div>
                <span className="cb-go">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener">
                <div className="cb-row-text">
                  <span className="cb-row-label">View Resume</span>
                  <span className="cb-row-sub">PDF / online</span>
                </div>
                <span className="cb-go">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener">
                <div className="cb-row-text">
                  <span className="cb-row-label">Schedule a call</span>
                  <span className="cb-row-sub">Calendly</span>
                </div>
                <span className="cb-go">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </a>
            </li>
          </ul>

          {/* Social links */}
          <div className="cb-social">
            <div className="cb-social-head">
              <span className="cb-title">Social</span>
            </div>
            <ul className="cb-social-grid">
              {socials.map(s => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener" aria-label={s.label}>
                    <SocialIcon icon={s.icon} />
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Theme toggle */}
          <div className="cb-theme">
            <div className="cb-theme-head">
              <span className="cb-title">Theme</span>
            </div>
            <div className="cb-switch" data-on={theme}>
              <button aria-pressed={theme === 'light'} onClick={() => toggleTheme('light')}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
                Light
              </button>
              <button aria-pressed={theme === 'dark'} onClick={() => toggleTheme('dark')}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* Right slab - info */}
        <div className="cb-slab cb-slab--side">
          <div className="cb-handle"/><div className="cb-handle"/>
          <div className="cb-handle"/><div className="cb-handle"/>

          <div className="cb-head">
            <h3 className="cb-title">About</h3>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <span className="cb-row-sub" style={{ display: 'block', marginBottom: '0.3rem' }}>Name</span>
              <span style={{ fontWeight: 520, fontSize: '1rem' }}>{person.name}</span>
            </div>
            <div>
              <span className="cb-row-sub" style={{ display: 'block', marginBottom: '0.3rem' }}>Role</span>
              <span style={{ fontWeight: 520, fontSize: '1rem' }}>{person.title}</span>
            </div>
            <div>
              <span className="cb-row-sub" style={{ display: 'block', marginBottom: '0.3rem' }}>Location</span>
              <span style={{ fontWeight: 520, fontSize: '1rem' }}>{person.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
