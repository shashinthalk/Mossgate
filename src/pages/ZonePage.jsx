import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { View } from '@react-three/drei'
import { PieceScene } from '../three/Garden'
import { useGarden } from '../state/store'
import { zoneById, ZONES } from '../data/zones'
import Photo from '../components/Photo'
import SeasonToggle from '../components/SeasonToggle'
import { Arrow, Chevron, Hand } from '../components/Icons'

const up = (d = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] },
})

export default function ZonePage() {
  const { id } = useParams()
  const season = useGarden((s) => s.season)
  const z = zoneById[id]
  if (!z) return <Navigate to="/" replace />
  const idx = ZONES.indexOf(z)
  const prev = ZONES[(idx - 1 + ZONES.length) % ZONES.length]
  const next = ZONES[(idx + 1) % ZONES.length]

  return (
    <article className="zp" style={{ '--accent': z.accent }} key={z.id}>
      <header className="zp__hero container">
        <motion.div className="zp__intro" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <Link to={`/?focus=${z.id}`} className="back-link"><Chevron dir="left" width={16} height={16} /> Back to the map</Link>
          <span className="eyebrow"><span className="dot" style={{ background: z.accent }} /> {z.kicker}</span>
          <h1>{z.title}</h1>
          <p className="lead">{z.blurb}</p>
          <div className="zp__season-row">
            <SeasonToggle />
            <span className="muted">See it in {season === 'winter' ? 'summer' : 'winter'}</span>
          </div>
        </motion.div>
        <div className="zp__stage">
          <View className="zp__view">
            <PieceScene id={z.id} />
          </View>
          <span className="zone__hint"><Hand width={14} height={14} /> Tap to play · drag to turn</span>
        </div>
      </header>

      <section className="container zp__body">
        <motion.div className="zp__text" {...up()}>
          <h2>About</h2>
          <p>{z.body}</p>
          <div className="zp__seasonal">
            <span className="eyebrow">{season === 'winter' ? 'Winter' : 'Summer'} at the {z.kicker.toLowerCase()}</span>
            <p>{z.seasonal[season]}</p>
          </div>
        </motion.div>
        <motion.aside className="zp__facts" {...up(0.1)}>
          <dl className="facts facts--grid">
            {z.facts.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <h3>Don’t miss</h3>
          <ul className="ticks">
            {z.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </motion.aside>
      </section>

      <section className="container gallery">
        {z.images.map((p, i) => (
          <motion.div key={p.id} className={`gallery__item g${i}`} {...up(i * 0.06)}>
            <Photo p={p} w={i === 0 ? 1200 : 700} />
          </motion.div>
        ))}
      </section>

      <nav className="container zp__pager" aria-label="More places">
        <Link to={`/explore/${prev.id}`} className="pager-card" style={{ '--accent': prev.accent }}>
          <small><Chevron dir="left" width={14} height={14} /> Previous</small>
          <strong>{prev.title}</strong>
        </Link>
        <Link to={`/explore/${next.id}`} className="pager-card is-next" style={{ '--accent': next.accent }}>
          <small>Next <Chevron width={14} height={14} /></small>
          <strong>{next.title}</strong>
        </Link>
      </nav>

      <section className="container">
        <div className="cta__card">
          <div>
            <span className="eyebrow">Come and see it</span>
            <h2>Plan a visit to the {z.kicker.toLowerCase()}</h2>
          </div>
          <Link to="/visit" className="btn btn--light">Tickets & hours <Arrow /></Link>
        </div>
      </section>
    </article>
  )
}
