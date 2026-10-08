import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGarden } from '../state/store'
import { GARDEN, ZONES, WINTER_IMAGES } from '../data/zones'
import Photo from '../components/Photo'
import SeasonToggle from '../components/SeasonToggle'
import { Arrow } from '../components/Icons'

const TICKETS = [
  ['Adult', '€9'],
  ['Concession', '€6'],
  ['Under 12', 'Free'],
  ['Annual pass', '€45'],
]

export default function Visit() {
  const season = useGarden((s) => s.season)
  const hero = season === 'winter' ? WINTER_IMAGES[0] : ZONES[0].images[1]
  return (
    <article className="visit">
      <header className="container visit__hero">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <span className="eyebrow">Plan your visit</span>
          <h1>Open every day,<br /><em>all year.</em></h1>
          <p className="lead">Paths are step-free, dogs on short leads are welcome, and the café by the gate serves until an hour before closing.</p>
          <SeasonToggle />
        </motion.div>
        <Photo p={hero} w={1100} ratio="4 / 3" />
      </header>

      <section className="container visit__grid">
        <div className="card">
          <span className="eyebrow">{season === 'winter' ? 'Winter hours · Nov – Mar' : 'Summer hours · Apr – Oct'}</span>
          <p className="big">{GARDEN.hours[season]}</p>
          <p className="muted">Last entry 45 minutes before closing.{season === 'winter' ? ' Lantern evenings every Friday in December until 20:00.' : ' Music evenings on Fridays until 22:00.'}</p>
        </div>
        <div className="card">
          <span className="eyebrow">Tickets</span>
          <dl className="price-list">
            {TICKETS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
        <div className="card">
          <span className="eyebrow">Getting here</span>
          <p>{GARDEN.address}</p>
          <p className="muted">Bus 14 to Mossgate Lane (3 min walk). Bike racks at both gates; 40 parking spaces on Riverside Road.</p>
        </div>
      </section>

      <section className="container">
        <h2 className="section-title">What’s on this {season}</h2>
        <div className="events">
          {ZONES.map((z) => (
            <Link key={z.id} to={`/explore/${z.id}`} className="event" style={{ '--accent': z.accent }}>
              <span className="dot" />
              <div>
                <strong>{z.title}</strong>
                <p className="muted">{z.seasonal[season]}</p>
              </div>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>
    </article>
  )
}
