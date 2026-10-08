import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SeasonToggle from './SeasonToggle'
import { Close, Leaf, Menu } from './Icons'
import { ZONES } from '../data/zones'
import { useGarden } from '../state/store'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const select = useGarden((s) => s.select)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className={`nav ui-layer ${scrolled ? 'is-scrolled' : ''}`}>
      <Link to="/" className="brand" onClick={() => select(null)}>
        <span className="brand__mark"><Leaf width={16} height={16} /></span>
        <span className="brand__name">Mossgate</span>
      </Link>
      <nav className="nav__links" aria-label="Main">
        <Link to="/#explore">Explore</Link>
        <Link to="/explore/trees">Trees</Link>
        <Link to="/explore/pavilion">Events</Link>
        <Link to="/visit">Visit</Link>
      </nav>
      <div className="nav__right">
        <SeasonToggle />
        <Link to="/visit" className="btn btn--dark nav__cta">Plan a visit</Link>
        <button className="nav__menu" aria-label="Open menu" onClick={() => setOpen(true)}><Menu /></button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="sheet ui-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="sheet__panel" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} transition={{ type: 'spring', damping: 26, stiffness: 260 }}>
              <div className="sheet__head">
                <span className="eyebrow">Explore the garden</span>
                <button className="icon-btn" aria-label="Close menu" onClick={() => setOpen(false)}><Close /></button>
              </div>
              <ul className="sheet__list">
                {ZONES.map((z, i) => (
                  <motion.li key={z.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
                    <button onClick={() => { setOpen(false); navigate(`/explore/${z.id}`) }}>
                      <span className="dot" style={{ background: z.accent }} />
                      <span>{z.title}</span>
                      <small>{z.kicker}</small>
                    </button>
                  </motion.li>
                ))}
              </ul>
              <div className="sheet__foot">
                <SeasonToggle />
                <Link to="/visit" className="btn btn--dark">Plan a visit</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
