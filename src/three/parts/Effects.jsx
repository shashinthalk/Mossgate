import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import { seasonMix, useGarden } from '../../state/store'
import { zoneById, ZONES } from '../../data/zones'

const fromUI = (e) => {
  const t = e?.nativeEvent?.target
  return !!(t && t.closest && t.closest('button, a, input, .ui-layer'))
}

let _dot
function dotTexture() {
  if (_dot) return _dot
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.5, 'rgba(255,255,255,0.9)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  _dot = new THREE.CanvasTexture(c)
  return _dot
}

export function Snow({ count = 700, radius = 11, height = 12, size = 0.12 }) {
  const ref = useRef()
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * radius
      positions[i * 3] = Math.cos(a) * r
      positions[i * 3 + 1] = Math.random() * height
      positions[i * 3 + 2] = Math.sin(a) * r
      speeds[i] = 0.4 + Math.random() * 0.7
    }
    return { positions, speeds }
  }, [count, radius, height])
  useFrame((s, dt) => {
    const v = seasonMix.v
    const pts = ref.current
    if (!pts) return
    pts.visible = v > 0.02
    pts.material.opacity = v * 0.95
    if (!pts.visible) return
    const p = pts.geometry.attributes.position
    const t = s.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      let y = p.array[i * 3 + 1] - speeds[i] * dt
      if (y < -0.2) y = height
      p.array[i * 3 + 1] = y
      p.array[i * 3] += Math.sin(t * 0.8 + i) * dt * 0.15
    }
    p.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={size} map={dotTexture()} transparent depthWrite={false} color="#ffffff" sizeAttenuation />
    </points>
  )
}

function Butterfly({ seed, center, r = 1.2, color = '#f7a3c0' }) {
  const ref = useRef(), wl = useRef(), wr = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime + seed * 10
    const k = Math.max(0.001, 1 - seasonMix.v)
    const g = ref.current
    if (!g) return
    g.visible = k > 0.02
    const x = center[0] + Math.sin(t * 0.5) * r + Math.sin(t * 1.3) * 0.3
    const z = center[1] + Math.cos(t * 0.37) * r * 0.8
    const y = 0.7 + Math.sin(t * 1.7) * 0.25
    const nx = center[0] + Math.sin((t + 0.05) * 0.5) * r + Math.sin((t + 0.05) * 1.3) * 0.3
    const nz = center[1] + Math.cos((t + 0.05) * 0.37) * r * 0.8
    g.position.set(x, y, z)
    g.rotation.y = Math.atan2(nx - x, nz - z)
    g.scale.setScalar(k)
    const flap = Math.sin(t * 22) * 0.9
    wl.current.rotation.z = flap
    wr.current.rotation.z = -flap
  })
  return (
    <group ref={ref}>
      <group ref={wl}>
        <mesh position={[0.07, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.08, 10]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={wr}>
        <mesh position={[-0.07, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.08, 10]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}

export function Butterflies({ spots = [[-4.6, 1.5], [3.9, 2.2], [-6.8, -3.5], [1.7, -6.6], [-3.2, 6.0]] }) {
  const colors = ['#f7a3c0', '#f7d23a', '#ffffff', '#f58a2c', '#a9c4f2']
  return spots.map((c, i) => <Butterfly key={i} seed={i} center={c} color={colors[i % colors.length]} />)
}

// Confetti burst of themed particles when a zone is clicked.
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _s = new THREE.Vector3(), _e = new THREE.Euler()
function Burst({ b, onDone, scale = 1 }) {
  const ref = useRef()
  const zone = zoneById[b.zone]
  const parts = useMemo(() => Array.from({ length: 34 }, () => {
    const a = Math.random() * Math.PI * 2
    const sp = (1.4 + Math.random() * 2.2) * scale
    return {
      v: [Math.cos(a) * sp * 0.6, (2.5 + Math.random() * 2.5) * scale, Math.sin(a) * sp * 0.6],
      r: [Math.random() * 6, Math.random() * 6, Math.random() * 6],
      s: (0.06 + Math.random() * 0.07) * scale,
      c: zone.burst[Math.floor(Math.random() * zone.burst.length)],
    }
  }), [])
  useEffect(() => {
    parts.forEach((p, i) => ref.current.setColorAt(i, new THREE.Color(p.c)))
    ref.current.instanceColor.needsUpdate = true
  }, [])
  useFrame(() => {
    const t = (performance.now() - b.t) / 1000
    if (t > 1.8) return onDone()
    parts.forEach((p, i) => {
      const x = b.point[0] + p.v[0] * t
      const y = b.point[1] + p.v[1] * t - 4.5 * scale * t * t
      const z = b.point[2] + p.v[2] * t
      _e.set(p.r[0] + t * 6, p.r[1] + t * 4, p.r[2])
      _q.setFromEuler(_e)
      const k = p.s * (t < 1.2 ? 1 : Math.max(0, 1 - (t - 1.2) / 0.6))
      _m.compose(_v.set(x, Math.max(y, 0.03), z), _q, _s.set(k, k * 0.35, k))
      ref.current.setMatrixAt(i, _m)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[null, null, parts.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.6} />
    </instancedMesh>
  )
}

export function Bursts({ scope = 'hero', scale = 1 }) {
  const bursts = useGarden((s) => s.bursts)
  const [done, setDone] = useState({})
  return bursts
    .filter((b) => !done[b.key] && (b.scope || 'hero') === scope)
    .map((b) => <Burst key={b.key} b={b} scale={scale} onDone={() => setDone((d) => ({ ...d, [b.key]: true }))} />)
}

// Pulsing beacons that invite the visitor to click.
function Marker({ zone }) {
  const ring = useRef(), dot = useRef(), g = useRef()
  const select = useGarden((s) => s.select)
  const burst = useGarden((s) => s.burst)
  const setHovered = useGarden((s) => s.setHovered)
  const phase = useMemo(() => Math.random() * 3, [])
  useFrame((s) => {
    const t = s.clock.elapsedTime + phase
    const { selected, hovered } = useGarden.getState()
    const k = (t % 2.2) / 2.2
    if (ring.current) {
      ring.current.scale.setScalar(1 + k * 1.6)
      ring.current.material.opacity = (1 - k) * 0.85
    }
    const dim = selected && selected !== zone.id ? 0.25 : 1
    const target = (hovered === zone.id ? 1.35 : 1) * (selected === zone.id ? 0 : 1)
    g.current.scale.lerp(_v.setScalar(Math.max(0.001, target)), 0.15)
    g.current.position.y = zone.marker[1] + Math.sin(t * 2) * 0.12
    dot.current.material.opacity = dim
  })
  return (
    <group ref={g} position={zone.marker}>
      <Billboard>
        <mesh
          ref={dot}
          renderOrder={20}
          onPointerOver={(e) => { e.stopPropagation(); if (fromUI(e)) return; setHovered(zone.id); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { setHovered(null); document.body.style.cursor = '' }}
          onClick={(e) => { e.stopPropagation(); if (fromUI(e)) return; select(zone.id); burst(zone.id, zone.marker) }}
        >
          <circleGeometry args={[0.24, 32]} />
          <meshBasicMaterial color="#ffffff" transparent depthTest={false} />
        </mesh>
        <mesh position={[0, 0, -0.001]} renderOrder={18}>
          <ringGeometry args={[0.24, 0.27, 32]} />
          <meshBasicMaterial color={zone.accent} transparent opacity={0.5} depthTest={false} />
        </mesh>
        <mesh position={[0, 0, 0.001]} renderOrder={21}>
          <circleGeometry args={[0.11, 24]} />
          <meshBasicMaterial color={zone.accent} depthTest={false} />
        </mesh>
        <mesh ref={ring} renderOrder={19}>
          <ringGeometry args={[0.26, 0.31, 40]} />
          <meshBasicMaterial color={zone.accent} transparent depthTest={false} depthWrite={false} />
        </mesh>
      </Billboard>
    </group>
  )
}

export function Markers() {
  return ZONES.map((z) => <Marker key={z.id} zone={z} />)
}
