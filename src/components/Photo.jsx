import { useState } from 'react'
import { unsplash } from '../data/zones'

export default function Photo({ p, w = 900, className = '', ratio }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <figure className={`photo ${loaded ? 'is-loaded' : ''} ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      <img
        src={unsplash(p.id, w)}
        srcSet={`${unsplash(p.id, Math.round(w / 2))} ${Math.round(w / 2)}w, ${unsplash(p.id, w)} ${w}w, ${unsplash(p.id, w * 2)} ${w * 2}w`}
        sizes={`(max-width: 760px) 92vw, ${w}px`}
        alt={p.alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
      <figcaption>
        <a href={p.link} target="_blank" rel="noreferrer">{p.author}</a> / Unsplash
      </figcaption>
    </figure>
  )
}
