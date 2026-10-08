import * as THREE from 'three'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { rng, toW, useSeasonMat, usePlayful } from '../common'
import { seasonMix } from '../../state/store'

/* ---------- rocks ---------- */
function rockGeometry(seed) {
  const g = new THREE.DodecahedronGeometry(1, 1)
  const r = rng(seed)
  const p = g.attributes.position
  const cache = new Map()
  for (let i = 0; i < p.count; i++) {
    const key = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`
    let k = cache.get(key)
    if (!k) { k = 0.82 + r() * 0.3; cache.set(key, k) }
    let y = p.getY(i) * k
    if (y < -0.35) y = -0.35 + (y + 0.35) * 0.2
    p.setXYZ(i, p.getX(i) * k, y, p.getZ(i) * k)
  }
  g.computeVertexNormals()
  return g
}

function SnowLayer({ scale = [1, 1, 1], position = [0, 0, 0] }) {
  const ref = useRef()
  useFrame(() => {
    const v = Math.max(0.001, seasonMix.v)
    if (ref.current) ref.current.scale.set(scale[0] * v, scale[1] * v, scale[2] * v)
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#f7fafc" roughness={0.95} />
    </mesh>
  )
}

export function Rock({ zone = 'rocks', size = 1, seed = 1, sy = 1, delay = 0, color = '#cfcfc9', snow = true, ...props }) {
  const geo = useMemo(() => rockGeometry(seed), [seed])
  const mat = useSeasonMat(color, '#c3c6c8', { flat: true, rough: 0.9 })
  const ref = usePlayful(zone, { delay, amp: 0.7 })
  const s = size / 2
  return (
    <group {...props}>
      <group ref={ref}>
        <mesh castShadow receiveShadow geometry={geo} material={mat} scale={[s, s * sy * 0.85, s]} position={[0, s * sy * 0.3, 0]} />
        {snow && <SnowLayer scale={[s * 0.75, s * sy * 0.35, s * 0.7]} position={[0, s * sy * 0.62, 0]} />}
      </group>
    </group>
  )
}

export const BIG_ROCKS = [
  [-4.7, -7.4, 2.75, 3, 1.3],
  [-3.0, -7.9, 2.3, 7, 1.3],
  [2.12, -7.35, 1.2, 11, 1],
  [6.4, -3.6, 1.7, 15, 1],
  [5.6, 2.65, 1.7, 21, 1],
]

export function BigRocks() {
  return BIG_ROCKS.map(([x, z, s, seed, sy], i) => (
    <Rock key={i} position={[x, -0.04, z]} size={s} seed={seed} sy={sy} delay={i * 0.07} />
  ))
}

const STREAM_STONES = [[328,262,55],[345,292,45],[300,300,40],[392,330,50],[402,362,60],[385,410,55],[322,392,40],[338,436,45],[268,440,40],[430,470,40],[448,548,70],[503,548,75],[548,520,60],[420,545,45],[475,500,40],[260,490,35]]

export function StreamStones() {
  return STREAM_STONES.map((s, i) => {
    let [x, z] = toW(s)
    const r = Math.hypot(x, z)
    if (r > 8.5) { x *= 8.5 / r; z *= 8.5 / r }
    return <Rock key={i} zone="water" position={[x, -0.03, z]} size={(s[2] * 1.6) / 100} seed={30 + i} delay={i * 0.03} color={i % 3 ? '#c8c8c2' : '#b9bab4'} />
  })
}

/* ---------- mushrooms ---------- */
export function Mushroom({ zone = 'fungi', s = 1, delay = 0, ...props }) {
  const cap = useSeasonMat('#e3392f', '#d8352c', { rough: 0.5 })
  const stem = useSeasonMat('#f6f0e2', '#f6f0e2')
  const ref = usePlayful(zone, { delay, amp: 1.6, sway: 0.05, swaySpeed: 1.6, phase: delay * 10 })
  const dots = useMemo(() => Array.from({ length: 7 }, (_, k) => {
    if (k === 6) return [0, 0.75, 0]
    const a = k * 1.05 + 0.3
    return [Math.cos(a) * 0.25, 0.66, Math.sin(a) * 0.25]
  }), [])
  return (
    <group {...props} scale={s}>
      <group ref={ref}>
        <mesh castShadow position={[0, 0.25, 0]} material={stem}>
          <cylinderGeometry args={[0.09, 0.12, 0.5, 14]} />
        </mesh>
        <mesh castShadow position={[0, 0.5, 0]} scale={[0.42, 0.3, 0.42]} material={cap}>
          <sphereGeometry args={[1, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.42, 24]} />
          <meshStandardMaterial color="#f3e2c9" side={THREE.DoubleSide} />
        </mesh>
        {dots.map((d, i) => (
          <mesh key={i} position={d} scale={[1, 0.5, 1]}>
            <sphereGeometry args={[0.055, 8, 6]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function MushroomPatch() {
  return (
    <group>
      <Mushroom position={[-4.5, 0, -2.5]} s={1} />
      <Mushroom position={[-5.15, 0, -0.75]} s={0.65} delay={0.1} />
      <Mushroom position={[-3.95, 0, -1.8]} s={0.5} delay={0.2} />
    </group>
  )
}

/* ---------- bushes / hedges ---------- */
const BUSHES = [[262,232,70],[292,222,80],[330,218,75],[366,226,70],[392,250,60],[255,262,55],[408,282,55],[262,330,55],[300,345,50],[402,410,60],[445,330,50],[225,215,50]]

export function Bush({ zone = 'hedges', s = 0.7, seed = 1, delay = 0, ...props }) {
  const greens = ['#4f9e34', '#5aaa3a', '#468f2f', '#62b23f']
  const r = useMemo(() => rng(seed), [seed])
  const parts = useMemo(() => Array.from({ length: 3 }, (_, k) => {
    const ss = s * (0.7 + r() * 0.4)
    return { ss, x: (r() - 0.5) * s * 1.1, z: (r() - 0.5) * s * 0.9, c: greens[(seed + k) % 4] }
  }), [s, seed])
  const m0 = useSeasonMat(greens[seed % 4], '#e3ebe7', { flat: true, rough: 0.9 })
  const m1 = useSeasonMat(greens[(seed + 1) % 4], '#d6e2dd', { flat: true, rough: 0.9 })
  const ref = usePlayful(zone, { delay, amp: 1.2 })
  return (
    <group {...props}>
      <group ref={ref}>
        {parts.map((p, i) => (
          <mesh key={i} castShadow receiveShadow position={[p.x, p.ss * 0.38, p.z]} scale={[p.ss * 0.65, p.ss * 0.5, p.ss * 0.6]} material={i % 2 ? m1 : m0}>
            <icosahedronGeometry args={[1, 1]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function Hedges() {
  return BUSHES.map((b, i) => {
    const [x, z] = toW(b)
    return <Bush key={i} position={[x, 0, z]} s={b[2] / 100} seed={i + 1} delay={i * 0.04} />
  })
}

/* ---------- flowers ---------- */
const PAL = {
  o: ['#f2672e', '#f58a2c', '#e8452c'],
  y: ['#f7d23a', '#f5b82a', '#fbe36a'],
  b: ['#7fa8e8', '#a9c4f2', '#ffffff'],
  p: ['#f07aa0', '#e54b6b', '#f7a3c0'],
}
export const FLOWERBEDS = [[100,255,'o',60],[62,300,'o',55],[45,410,'y',50],[240,372,'o',55],[228,492,'o',60],[515,405,'y',60],[605,462,'y',80],[650,385,'o',55],[305,560,'y',60],[268,555,'p',50],[470,212,'y',45],[298,182,'y',45],[140,225,'b',55],[188,415,'b',75],[440,365,'b',50],[608,390,'b',55],[392,298,'b',45],[622,250,'b',50],[428,442,'b',55],[422,306,'p',45],[512,275,'o',55],[552,560,'p',45],[85,470,'p',45],[668,430,'b',40],[680,290,'y',40],[560,250,'b',40],[330,515,'o',40],[215,300,'o',40]]

export function bedPositions(list = FLOWERBEDS) {
  return list.map((f) => {
    let [x, z] = toW(f)
    const r = Math.hypot(x, z)
    if (r > 8.4) { x *= 8.4 / r; z *= 8.4 / r }
    return { x, z, pal: PAL[f[2]], s: f[3] / 100 }
  })
}

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _sc = new THREE.Vector3(), _c = new THREE.Color()

// Many beds in two instanced meshes (leaves + blooms).
export function FlowerBeds({ zone = 'flowers', beds = bedPositions(), seed = 5 }) {
  const leaves = useRef(), blooms = useRef(), bloomGroup = useRef()
  const data = useMemo(() => {
    const r = rng(seed)
    const out = []
    beds.forEach((b) => {
      const n = 9 + Math.floor(r() * 5)
      for (let k = 0; k < n; k++) {
        const a = r() * Math.PI * 2, rr = r() * b.s * 0.62
        const fs = (0.14 + r() * 0.1) * 1.0
        out.push({ x: b.x + Math.cos(a) * rr, y: b.s * 0.3 + r() * b.s * 0.25, z: b.z + Math.sin(a) * rr * 0.8, s: fs, c: b.pal[Math.floor(r() * 3)], ph: r() * 6 })
      }
    })
    return out
  }, [beds, seed])
  useLayoutEffect(() => {
    beds.forEach((b, i) => {
      _m.compose(_v.set(b.x, b.s * 0.2, b.z), _q.identity(), _sc.set(b.s * 0.78, b.s * 0.32, b.s * 0.62))
      leaves.current.setMatrixAt(i, _m)
    })
    leaves.current.instanceMatrix.needsUpdate = true
    data.forEach((d, i) => {
      blooms.current.setColorAt(i, _c.set(d.c))
    })
    blooms.current.instanceColor.needsUpdate = true
  }, [beds, data])
  const leafMat = useSeasonMat('#3f9a2e', '#e6ede9', { flat: true, rough: 0.9 })
  const ref = usePlayful(zone, { amp: 0.8 })
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const v = seasonMix.v
    const grow = Math.max(0.001, 1 - v)
    data.forEach((d, i) => {
      const bob = Math.sin(t * 2 + d.ph) * 0.02
      _m.compose(_v.set(d.x, d.y + bob, d.z), _q.identity(), _sc.setScalar(d.s * grow))
      blooms.current.setMatrixAt(i, _m)
    })
    blooms.current.instanceMatrix.needsUpdate = true
  })
  return (
    <group ref={ref}>
      <instancedMesh ref={leaves} args={[null, leafMat, beds.length]} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 1]} />
      </instancedMesh>
      <group ref={bloomGroup}>
        <instancedMesh ref={blooms} args={[null, null, data.length]} castShadow>
          <icosahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial roughness={0.6} flatShading />
        </instancedMesh>
      </group>
    </group>
  )
}

/* ---------- lily pads ---------- */
const PADS = [[352,338,46],[296,430,40],[462,528,48],[318,300,30],[395,520,30]]
export function LilyPads({ zone = 'water' }) {
  const group = useRef()
  const pads = useMemo(() => PADS.map((p, i) => {
    const [x, z] = toW(p)
    return { x, z, r: (p[2] * 0.8) / 100, rot: i * 1.7 }
  }), [])
  const mat = useSeasonMat('#4fb83a', '#dbe7ea', { side: THREE.DoubleSide })
  useFrame((s) => {
    const t = s.clock.elapsedTime
    group.current?.children.forEach((c, i) => {
      c.position.y = 0.035 + Math.sin(t * 1.4 + i) * 0.012
      c.rotation.z = pads[i]?.rot + Math.sin(t * 0.4 + i) * 0.15
    })
  })
  return (
    <group>
      <group ref={group}>
        {pads.map((p, i) => (
          <mesh key={i} position={[p.x, 0.035, p.z]} rotation={[-Math.PI / 2, 0, p.rot]} material={mat} receiveShadow>
            <circleGeometry args={[p.r, 20, 0, Math.PI * 1.78]} />
          </mesh>
        ))}
      </group>
      <LilyFlower position={[toW([352, 338])[0] + 0.08, 0.06, toW([352, 338])[1]]} />
    </group>
  )
}

function LilyFlower(props) {
  const ref = useRef()
  useFrame(() => ref.current && ref.current.scale.setScalar(Math.max(0.001, 1 - seasonMix.v)))
  return (
    <group ref={ref} {...props}>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} rotation={[0.5, (i / 6) * Math.PI * 2, 0]} position={[Math.sin((i / 6) * Math.PI * 2) * 0.05, 0.03, Math.cos((i / 6) * Math.PI * 2) * 0.05]} scale={[0.04, 0.02, 0.09]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#f5a3c4" />
        </mesh>
      ))}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color="#f7d23a" />
      </mesh>
    </group>
  )
}

/* ---------- rim blossoms + grass tufts (decor) ---------- */
export function RimBlossoms() {
  const ref = useRef()
  const pts = useMemo(() => {
    const r = rng(11)
    const out = []
    for (let i = 0; i < 70; i++) out.push([(105 + r() * 95) * Math.PI / 180, 7.9 + r() * 0.85, 0.07 + r() * 0.06])
    for (let i = 0; i < 24; i++) out.push([(-60 + r() * 120) * Math.PI / 180, 8.0 + r() * 0.7, 0.07 + r() * 0.05])
    return out
  }, [])
  useFrame(() => {
    const k = Math.max(0.001, 1 - seasonMix.v)
    pts.forEach(([a, r, s], i) => {
      _m.compose(_v.set(Math.cos(a) * r, s * 0.3, Math.sin(a) * r), _q.identity(), _sc.set(s * k, s * 0.7 * k, s * k))
      ref.current.setMatrixAt(i, _m)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[null, null, pts.length]}>
      <sphereGeometry args={[0.5, 6, 5]} />
      <meshStandardMaterial color="#ffffff" roughness={0.7} />
    </instancedMesh>
  )
}

const TUFTS = [[85,345,1.2],[272,345,1],[245,560,0.9],[398,258,0.8],[532,300,1],[90,440,0.9],[480,300,0.8],[640,470,0.9],[365,440,0.8],[180,560,0.8]]
export function GrassTufts() {
  const ref = useRef()
  const blades = useMemo(() => {
    const r = rng(3)
    const out = []
    TUFTS.forEach((t) => {
      let [x, z] = toW(t)
      const rr = Math.hypot(x, z)
      if (rr > 8.4) { x *= 8.4 / rr; z *= 8.4 / rr }
      for (let k = 0; k < 6; k++) {
        const a = (k * 60 + r() * 20) * Math.PI / 180
        out.push({ x: x + Math.cos(a) * 0.08 * t[2], z: z + Math.sin(a) * 0.08 * t[2], h: (0.6 + r() * 0.4) * t[2], a, tilt: 0.2 + r() * 0.3, ph: r() * 6 })
      }
    })
    return out
  }, [])
  const mat = useSeasonMat('#6cc444', '#cfdcd6', { flat: true })
  const e = new THREE.Euler()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    blades.forEach((b, i) => {
      e.set(0, -b.a, -(b.tilt + Math.sin(t * 1.5 + b.ph) * 0.06), 'YXZ')
      _q.setFromEuler(e)
      _m.compose(_v.set(b.x, b.h * 0.4, b.z), _q, _sc.set(1, b.h, 1))
      ref.current.setMatrixAt(i, _m)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[null, mat, blades.length]}>
      <coneGeometry args={[0.05, 1, 5]} />
    </instancedMesh>
  )
}
