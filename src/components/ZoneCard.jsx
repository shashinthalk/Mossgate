import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGarden } from '../state/store'
import { zoneById, ZONES } from '../data/zones'
import { Arrow, ArrowDown, Chevron, Close } from './Icons'
import Photo from './Photo'

export default function ZoneCard() {
  const selected = useGarden((s) => s.selected)
  const season = useGarden((s) => s.season)
  const select = useGarden((s) => s.select)
  const burst = useGarden((s) => s.burst)
  const navigate = useNavigate()
  const z = selected ? zoneById[selected] : null
  const idx = z ? ZONES.indexOf(z) : -1
  const go = (d) => {
    const n = ZONES[(idx + d + ZONES.length) % ZONES.length]
    select(n.id)
    burst(n.id, n.marker)
  }
  return (
    <AnimatePresence mode="wait">
      {z && (
        <motion.aside
          key={z.id}
          className="zone-card ui-layer"
          style={{ '--accent': z.accent }}
          initial={{ opacity: 0, y: 40, scale: 0.94, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: 'spring', damping: 20, stiffness: 240 }}
          role="dialog"
          aria-label={z.title}
        >
          <div className="zone-card__media">
            <Photo p={z.images[0]} w={640} ratio="16 / 9" />
          </div>
          <div className="zone-card__body">
            <div className="zone-card__top">
              <span className="eyebrow"><span className="dot" style={{ background: z.accent }} /> {z.kicker}</span>
              <button className="icon-btn" aria-label="Close" onClick={() => select(null)}><Close /></button>
            </div>
            <h3>{z.title}</h3>
            <p>{z.blurb}</p>
            <p className="zone-card__season">{z.seasonal[season]}</p>
            <div className="zone-card__actions">
              <button
                className="btn btn--dark"
                onClick={() => document.getElementById(`zone-${z.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                See the section <ArrowDown />
              </button>
              <button className="btn btn--ghost" onClick={() => navigate(`/explore/${z.id}`)}>
                Open page <Arrow />
              </button>
            </div>
            <div className="zone-card__nav">
              <button className="icon-btn" aria-label="Previous place" onClick={() => go(-1)}><Chevron dir="left" /></button>
              <span>{idx + 1} / {ZONES.length}</span>
              <button className="icon-btn" aria-label="Next place" onClick={() => go(1)}><Chevron /></button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
