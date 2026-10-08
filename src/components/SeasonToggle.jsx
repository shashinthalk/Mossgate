import { useGarden } from '../state/store'
import { Snowflake, Sun } from './Icons'

export default function SeasonToggle({ compact = false }) {
  const season = useGarden((s) => s.season)
  const toggle = useGarden((s) => s.toggleSeason)
  const winter = season === 'winter'
  return (
    <button
      className={`season-toggle ${winter ? 'is-winter' : ''} ${compact ? 'is-compact' : ''}`}
      onClick={toggle}
      aria-pressed={winter}
      aria-label={`Switch to ${winter ? 'summer' : 'winter'}`}
    >
      <span className="season-toggle__knob" />
      <span className="season-toggle__opt"><Sun /> {!compact && 'Summer'}</span>
      <span className="season-toggle__opt"><Snowflake /> {!compact && 'Winter'}</span>
    </button>
  )
}
