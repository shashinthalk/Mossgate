import { useEffect, useRef } from 'react'
import { useGarden } from '../state/store'
import { zoneById } from '../data/zones'

// Small label that follows the pointer while hovering a place in the 3D world.
export default function HoverTip() {
  const hovered = useGarden((s) => s.hovered)
  const selected = useGarden((s) => s.selected)
  const ref = useRef()
  useEffect(() => {
    const move = (e) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 14}px)`
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
  const z = hovered ? zoneById[hovered] : null
  return (
    <div ref={ref} className={`hover-tip ${z && z.id !== selected ? 'is-on' : ''}`} aria-hidden>
      {z && (
        <>
          <span className="dot" style={{ background: z.accent }} />
          {z.title}
          <small>Click to explore</small>
        </>
      )}
    </div>
  )
}
