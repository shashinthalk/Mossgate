import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { View } from '@react-three/drei'
import { HeroScene } from '../three/Garden'
import { useGarden } from '../state/store'
import { GARDEN, WINTER_IMAGES, ZONES } from '../data/zones'
import ZoneCard from '../components/ZoneCard'
import HoverTip from '../components/HoverTip'
import ZoneSection from '../components/ZoneSection'
import SeasonToggle from '../components/SeasonToggle'
import Photo from '../components/Photo'
import { Arrow, ArrowDown } from '../components/Icons'

function Hero() {
  const selected = useGarden((s) => s.selected)
  const select = useGarden((s) => s.select)
  const burst = useGarden((s) => s.burst)
  return (
    <section className={`hero ${selected ? 'is-focused' : ''}`}>
      <View className="hero__view">
        <HeroScene />
      </View>
      <motion.div
        className={`hero__intro ui-layer ${selected ? 'is-dim' : ''}`}
        initial={{ opacity: 0, y: 24 }}
        animate={selected ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
        transition={{ duration: selected ? 0.4 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="eyebrow">Mossgate Gardens · Riverside</span>
        <h1>Wander the<br /><em>garden.</em></h1>
        <p className="lead">Tap a tree, a flower bed or the red pavilion to find out what’s growing, what’s on, and where to go next.</p>
      </motion.div>
      <div className={`hero__chips ui-layer ${selected ? 'is-dim' : ''}`} role="list" aria-label="Places in the garden">
        {ZONES.map((z) => (
          <button
            key={z.id}
            role="listitem"
            className={`chip ${selected === z.id ? 'is-on' : ''}`}
            style={{ '--accent': z.accent }}
            onClick={() => { select(z.id); burst(z.id, z.marker) }}
          >
            <span className="dot" />{z.kicker}
          </button>
        ))}
      </div>
      <a href="#explore" className={`hero__scroll ui-layer ${selected ? 'is-hidden' : ''}`} aria-label="Scroll to explore">
        <ArrowDown />
      </a>
      <ZoneCard />
      <HoverTip />
    </section>
  )
}

export default function Home() {
  const [params] = useSearchParams()
  const select = useGarden((s) => s.select)
  const season = useGarden((s) => s.season)
  useEffect(() => {
    const f = params.get('focus')
    if (f) setTimeout(() => select(f), 400)
    return () => select(null)
  }, [params])

  return (
    <>
      <Hero />

      <section id="explore" className="intro container">
        <motion.p
          className="intro__statement"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          Eight places, one small garden. Each one has a story, a season and someone who looks after it.
        </motion.p>
        <div className="intro__index">
          {ZONES.map((z, i) => (
            <a key={z.id} href={`#zone-${z.id}`} style={{ '--accent': z.accent }}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              {z.title}
            </a>
          ))}
        </div>
      </section>

      {ZONES.map((z, i) => (
        <ZoneSection key={z.id} z={z} i={i} />
      ))}

      <section className="seasons container">
        <div className="seasons__head">
          <span className="eyebrow">Two gardens in one</span>
          <h2>{season === 'winter' ? 'Quiet, frosted, and ours alone.' : 'Long evenings, full beds, open late.'}</h2>
          <p className="lead">
            Switch the season and the whole garden changes with it: snow on the pines, frozen shallows, lanterns in the pavilion. Or long summer light, butterflies and every bed in bloom.
          </p>
          <SeasonToggle />
        </div>
        <div className="seasons__grid">
          {(season === 'winter' ? WINTER_IMAGES : [ZONES[1].images[1], ZONES[4].images[0], ZONES[0].images[1]]).map((p) => (
            <Photo key={p.id} p={p} w={700} ratio="3 / 4" />
          ))}
        </div>
      </section>

      <section className="cta container">
        <div className="cta__card ui-layer">
          <div>
            <span className="eyebrow">Open today</span>
            <h2>{GARDEN.hours[season]}</h2>
            <p className="muted">{GARDEN.address} · Free for under-12s</p>
          </div>
          <Link to="/visit" className="btn btn--light">Plan your visit <Arrow /></Link>
        </div>
      </section>
    </>
  )
}
