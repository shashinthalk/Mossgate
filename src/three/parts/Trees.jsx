import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { rng, useSeasonMat, usePlayful } from '../common'
import { seasonMix } from '../../state/store'

const TRUNK = '#7a5236'

function Trunk({ h, r = 0.05 }) {
  const mat = useSeasonMat(TRUNK, '#5e4433', { flat: true })
  return (
    <mesh castShadow position={[0, h / 2, 0]} material={mat}>
      <cylinderGeometry args={[r * 0.65, r, h, 7]} />
    </mesh>
  )
}

// Grows in with winter: snow caps / frosting.
function SnowCap({ children, ...props }) {
  const ref = useRef()
  useFrame(() => {
    const v = Math.max(0.001, seasonMix.v)
    if (ref.current) ref.current.scale.setScalar(v)
  })
  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  )
}

const snowMat = { color: '#f6f9fb', roughness: 0.9 }

export function OakTree({ zone = 'trees', h = 4.3, seed = 1, leaf = '#7dc843', leafWinter = '#e9eff3', delay = 0, ...props }) {
  const blobs = useMemo(() => {
    const r = rng(seed)
    const list = [[0, 0.72, 0, 0.27]]
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + r()
      list.push([Math.cos(a) * 0.2, 0.62 + r() * 0.16, Math.sin(a) * 0.17, 0.16 + r() * 0.06])
    }
    list.push([0, 0.9, 0, 0.17])
    return list
  }, [seed])
  const canopy = useSeasonMat(leaf, leafWinter, { flat: true, rough: 0.8 })
  const dark = useSeasonMat(shade(leaf, -0.12), shade(leafWinter, -0.06), { flat: true, rough: 0.8 })
  const ref = usePlayful(zone, { delay, sway: 0.025, swaySpeed: 0.9, phase: seed })
  return (
    <group {...props}>
      <group ref={ref}>
        <Trunk h={h * 0.55} r={h * 0.035} />
        <mesh castShadow position={[h * 0.06, h * 0.45, 0]} rotation={[0, 0, -0.7]}>
          <cylinderGeometry args={[h * 0.012, h * 0.02, h * 0.18, 5]} />
          <meshStandardMaterial color={TRUNK} flatShading />
        </mesh>
        {blobs.map((b, i) => (
          <mesh key={i} castShadow receiveShadow position={[b[0] * h, b[1] * h, b[2] * h]} material={i % 3 === 1 ? dark : canopy}>
            <icosahedronGeometry args={[b[3] * h, 1]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function PineTree({ zone = 'trees', h = 4.4, seed = 2, delay = 0, ...props }) {
  const mat = useSeasonMat('#2f7d3b', '#2f5f47', { flat: true, rough: 0.85 })
  const mat2 = useSeasonMat('#3a8f45', '#3a6b52', { flat: true, rough: 0.85 })
  const ref = usePlayful(zone, { delay, sway: 0.02, swaySpeed: 1.1, phase: seed })
  const tiers = [
    [0.42, 0.34, 0.38],
    [0.62, 0.27, 0.32],
    [0.8, 0.19, 0.27],
  ]
  return (
    <group {...props}>
      <group ref={ref}>
        <Trunk h={h * 0.3} r={h * 0.04} />
        {tiers.map(([y, r, th], i) => (
          <group key={i} position={[0, y * h, 0]}>
            <mesh castShadow receiveShadow material={i % 2 ? mat2 : mat}>
              <coneGeometry args={[r * h, th * h, 8]} />
            </mesh>
            <SnowCap position={[0, th * h * 0.18, 0]}>
              <mesh>
                <coneGeometry args={[r * h * 0.72, th * h * 0.64, 8]} />
                <meshStandardMaterial {...snowMat} flatShading />
              </mesh>
            </SnowCap>
          </group>
        ))}
      </group>
    </group>
  )
}

export function Cypress({ zone = 'trees', h = 3.6, delay = 0, ...props }) {
  const mat = useSeasonMat('#69b53e', '#dfe9e6', { rough: 0.85 })
  const ref = usePlayful(zone, { delay, sway: 0.03, swaySpeed: 1.3, phase: 3 })
  return (
    <group {...props}>
      <group ref={ref}>
        <Trunk h={0.7} r={0.08} />
        <mesh castShadow position={[0, h * 0.58, 0]} scale={[0.45, 1.65, 0.45]} material={mat}>
          <sphereGeometry args={[1, 18, 14]} />
        </mesh>
      </group>
    </group>
  )
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + 255 * amt)))
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255)
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// The whole tree collection placed as in the Spline layout.
export function TreeGrove() {
  return (
    <group>
      <OakTree h={4.3} seed={4} position={[-6.9, 0, -4.8]} delay={0} />
      <OakTree h={4.7} seed={9} leaf="#72c03c" position={[-4.0, 0, -8.2]} delay={0.08} />
      <PineTree h={4.3} seed={2} position={[-4.55, 0, -3.3]} delay={0.12} />
      <PineTree h={4.4} seed={6} position={[5.75, 0, -6.1]} delay={0.16} />
      <OakTree h={3.4} seed={12} leaf="#e7643f" leafWinter="#f1e9e6" position={[4.95, 0, -3.3]} delay={0.2} />
      <Cypress position={[-3.45, 0, -4.3]} delay={0.1} />
    </group>
  )
}
