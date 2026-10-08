import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { View } from '@react-three/drei'
import { PieceScene } from '../three/Garden'
import { useGarden } from '../state/store'
import Photo from './Photo'
import { Arrow, Hand } from './Icons'

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-12% 0px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
}

export default function ZoneSection({ z, i }) {
  const season = useGarden((s) => s.season)
  const select = useGarden((s) => s.select)
  const flip = i % 2 === 1
  return (
    <section id={`zone-${z.id}`} className={`zone ${flip ? 'is-flip' : ''}`} style={{ '--accent': z.accent }}>
      <div className="container zone__grid">
        <motion.div className="zone__stage" {...reveal}>
          <View className="zone__view">
            <PieceScene id={z.id} />
          </View>
          <span className="zone__hint"><Hand width={14} height={14} /> Tap it</span>
        </motion.div>
        <motion.div className="zone__copy" {...reveal} transition={{ ...reveal.transition, delay: 0.08 }}>
          <span className="eyebrow"><span className="num">{String(i + 1).padStart(2, '0')}</span> {z.kicker}</span>
          <h2>{z.title}</h2>
          <p className="lead">{z.blurb}</p>
          <p className="zone__season"><strong>{season === 'winter' ? 'In winter' : 'In summer'}.</strong> {z.seasonal[season]}</p>
          <dl className="facts">
            {z.facts.slice(0, 3).map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <div className="zone__photos">
            <Photo p={z.images[0]} w={520} ratio="4 / 5" />
            <Photo p={z.images[1]} w={520} ratio="4 / 5" />
          </div>
          <div className="zone__actions">
            <Link to={`/explore/${z.id}`} className="btn btn--dark">Explore {z.kicker.toLowerCase()} <Arrow /></Link>
            <button className="btn btn--ghost" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => select(z.id), 350) }}>
              Find it on the map
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
