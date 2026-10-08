import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { flagstoneTexture, ribbonGeometry, toW, useSeasonMat } from '../common'
import { seasonMix } from '../../state/store'

export const PATHS = [
  { pts: [[395,192],[330,214],[250,232],[170,262],[118,320],[106,392],[132,458],[190,510],[255,538],[305,520]], w: 1.5, y: 0.012 },
  { pts: [[470,442],[505,398],[524,346],[506,292],[470,250],[430,222],[392,200]], w: 1.4, y: 0.014 },
  { pts: [[515,338],[580,320],[640,316],[705,330]], w: 1.35, y: 0.016 },
]
const STREAM = [[300,240],[305,268],[322,300],[345,335],[352,372],[332,405],[295,432],[282,462],[318,490],[385,505],[445,515],[495,535],[540,566]]
const STREAM_W = [100, 140, 150, 170, 190, 180, 200, 230, 230, 210, 230, 260, 260].map((w) => w / 100)

export function IslandBase({ radius = 9 }) {
  const grass = useSeasonMat('#5fb534', '#eef3f6', { rough: 0.95 })
  const soil = useSeasonMat('#9a6a48', '#8f6a52', { rough: 1 })
  const soilDark = useSeasonMat('#7a4f35', '#6f5240', { rough: 1 })
  return (
    <group>
      <mesh receiveShadow position={[0, -0.23, 0]} material={grass}>
        <cylinderGeometry args={[radius, radius, 0.46, 96]} />
      </mesh>
      <mesh position={[0, -0.75, 0]} material={soil}>
        <cylinderGeometry args={[radius - 0.15, radius - 0.3, 0.7, 96]} />
      </mesh>
      <mesh position={[0, -1.25, 0]} material={soilDark}>
        <cylinderGeometry args={[radius - 0.4, radius - 1.1, 0.4, 96]} />
      </mesh>
    </group>
  )
}

export function Paths({ zone = 'bridge' }) {
  const geos = useMemo(() => PATHS.map((p) => ribbonGeometry(p.pts, p.w, { y: p.y })), [])
  const mat = useSeasonMat('#f3e8cf', '#e3e9ee', { map: flagstoneTexture(), rough: 0.95 })
  return geos.map((g, i) => <mesh key={i} geometry={g} material={mat} receiveShadow />)
}

export function Stream() {
  const bank = useMemo(() => ribbonGeometry(STREAM, STREAM_W.map((w) => w + 0.5), { y: 0.006, rmax: 8.92 }), [])
  const water = useMemo(() => ribbonGeometry(STREAM, STREAM_W, { y: 0.01, rmax: 8.92 }), [])
  const bankMat = useSeasonMat('#3f8f2c', '#c9d8de', { rough: 1 })
  const waterMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#4fa6bd', roughness: 0.15, metalness: 0.1, emissive: new THREE.Color('#1d5f73') }),
    []
  )
  const a = useMemo(() => new THREE.Color('#4fa6bd'), [])
  const b = useMemo(() => new THREE.Color('#bfe0ea'), [])
  useFrame((s) => {
    const t = s.clock.elapsedTime
    waterMat.color.copy(a).lerp(b, seasonMix.v)
    waterMat.emissiveIntensity = (0.18 + Math.sin(t * 1.3) * 0.06) * (1 - seasonMix.v)
    waterMat.roughness = 0.15 + seasonMix.v * 0.25
  })
  return (
    <group>
      <mesh geometry={bank} material={bankMat} receiveShadow />
      <mesh geometry={water} material={waterMat} receiveShadow />
      <Ripples />
    </group>
  )
}

// Expanding rings that pop up along the stream to make the water feel alive.
function Ripples() {
  const pts = useMemo(() => STREAM.slice(1, -1).map(toW), [])
  const rings = useRef([])
  const state = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ t: -i * 0.6, p: pts[i % pts.length] })), [pts])
  useFrame((_, dt) => {
    state.forEach((r, i) => {
      r.t += dt
      if (r.t > 2.4) {
        r.t = 0
        const p = pts[Math.floor(Math.random() * pts.length)]
        r.p = [p[0] + (Math.random() - 0.5) * 0.6, p[1] + (Math.random() - 0.5) * 0.6]
      }
      const m = rings.current[i]
      if (!m) return
      const k = Math.max(0, r.t) / 2.4
      m.position.set(r.p[0], 0.03, r.p[1])
      m.scale.setScalar(0.05 + k * 0.5)
      m.material.opacity = (1 - k) * 0.55 * (1 - seasonMix.v)
      m.visible = r.t > 0
    })
  })
  return state.map((_, i) => (
    <mesh key={i} ref={(el) => (rings.current[i] = el)} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.8, 1, 32]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
    </mesh>
  ))
}
