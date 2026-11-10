import { person } from '../data/content'

export default function HudFrame({ view, onNavigate }) {
  return (
    <header className="hud-frame" aria-label="Site header">
      <div className="hud-top hud-cluster">
        <button
          className="hud-link hud-home"
          onClick={() => onNavigate('work')}
          aria-label="Home"
          style={{ marginRight: 'auto' }}
        >
          {person.name}
        </button>
        <div className="top-right-group">
          <button
            className="hud-link"
            onClick={() => onNavigate('contact')}
            aria-current={view === 'contact' ? 'page' : undefined}
          >
            More
          </button>
        </div>
      </div>
    </header>
  )
}
