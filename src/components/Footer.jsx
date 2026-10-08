import { Link } from 'react-router-dom'
import { GARDEN, ZONES } from '../data/zones'
import { useGarden } from '../state/store'
import { Leaf } from './Icons'

export default function Footer() {
  const season = useGarden((s) => s.season)
  return (
    <footer className="footer ui-layer">
      <div className="footer__grid container">
        <div>
          <Link to="/" className="brand"><span className="brand__mark"><Leaf width={16} height={16} /></span><span className="brand__name">Mossgate</span></Link>
          <p className="muted footer__tag">{GARDEN.tagline}</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>{ZONES.slice(0, 4).map((z) => <li key={z.id}><Link to={`/explore/${z.id}`}>{z.title}</Link></li>)}</ul>
        </div>
        <div>
          <h4>&nbsp;</h4>
          <ul>{ZONES.slice(4).map((z) => <li key={z.id}><Link to={`/explore/${z.id}`}>{z.title}</Link></li>)}</ul>
        </div>
        <div>
          <h4>Visit</h4>
          <ul>
            <li>{GARDEN.address}</li>
            <li>{season === 'winter' ? 'Winter' : 'Summer'} hours · {GARDEN.hours[season]}</li>
            <li><Link to="/visit">Tickets & directions</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer__base container">
        <span>© {new Date().getFullYear()} Mossgate Gardens · A prototype</span>
        <span>Photography from <a href="https://unsplash.com/?utm_source=mossgate_gardens&utm_medium=referral" target="_blank" rel="noreferrer">Unsplash</a></span>
      </div>
    </footer>
  )
}
