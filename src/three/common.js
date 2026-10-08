import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { seasonMix, useGarden } from '../state/store'

// The garden was laid out against the reference render; image pixels -> world.
export const toW = (p) => [(p[0] - 370) * 0.0265, (p[1] - 360) * 0.045]

export function rng(seed = 1) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const cmr = (p0, p1, p2, p3, t) => {
  const t2 = t * t, t3 = t2 * t
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
}

// Flat ribbon along a Catmull-Rom curve through image-space points.
export function ribbonGeometry(pts, widths, { y = 0, rmax = Infinity, uvScale = 1 } = {}) {
  const q = pts.map(toW)
  const ws = Array.isArray(widths) ? widths : pts.map(() => widths)
  const s = []
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)]
    for (let k = 0; k < 12; k++) {
      const t = k / 12
      const e = t * t * (3 - 2 * t)
      s.push([cmr(p0[0], p1[0], p2[0], p3[0], t), cmr(p0[1], p1[1], p2[1], p3[1], t), ws[i] + (ws[i + 1] - ws[i]) * e])
    }
  }
  const last = q[q.length - 1]
  s.push([last[0], last[1], ws[ws.length - 1]])
  const pos = [], uv = [], idx = []
  let L = 0
  for (let i = 0; i < s.length; i++) {
    const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)]
    let dx = b[0] - a[0], dz = b[1] - a[1]
    const d = Math.hypot(dx, dz) || 1
    dx /= d; dz /= d
    if (i > 0) L += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1])
    const hw = s[i][2] / 2
    const pa = [s[i][0] - dz * hw, s[i][1] + dx * hw]
    const pb = [s[i][0] + dz * hw, s[i][1] - dx * hw]
    for (const p of [pa, pb]) {
      const r = Math.hypot(p[0], p[1])
      if (r > rmax) { p[0] *= rmax / r; p[1] *= rmax / r }
      pos.push(p[0], y, p[1])
    }
    uv.push(0, (L / s[i][2]) * uvScale, 1, (L / s[i][2]) * uvScale)
  }
  for (let i = 0; i < s.length - 1; i++) {
    const a = 2 * i
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  g.computeVertexNormals()
  // force normals up (ribbon is flat)
  const n = g.attributes.normal
  for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0)
  return g
}

// A material whose colour glides between summer and winter.
export function useSeasonMat(summer, winter = summer, opts = {}) {
  const { flat = false, rough = 0.85, metal = 0, emissive, transparent, opacity, map, side } = opts
  const m = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: summer,
      roughness: rough,
      metalness: metal,
      flatShading: flat,
      transparent: !!transparent,
      opacity: opacity ?? 1,
      map: map || null,
      side: side ?? THREE.FrontSide,
    })
    if (emissive) mat.emissive = new THREE.Color(emissive)
    return mat
  }, [])
  const a = useMemo(() => new THREE.Color(summer), [summer])
  const b = useMemo(() => new THREE.Color(winter), [winter])
  useFrame(() => {
    m.color.copy(a).lerp(b, seasonMix.v)
  })
  return m
}

// Procedural flagstone texture for the paths (drawn once on a canvas).
let _flag
export function flagstoneTexture() {
  if (_flag) return _flag
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const r = rng(7)
  ctx.fillStyle = '#c9b38a'
  ctx.fillRect(0, 0, size, size)
  const n = 4, cell = size / n
  for (let j = 0; j < n; j++) {
    for (let i = -1; i <= n; i++) {
      const ox = (j % 2) * cell * 0.5
      const x0 = i * cell + ox + 3 + r() * 4, y0 = j * cell + 3 + r() * 4
      const x1 = i * cell + ox + cell - 3 - r() * 4, y1 = j * cell + cell - 3 - r() * 4
      const v = 228 + Math.floor(r() * 20)
      ctx.fillStyle = `rgb(${v + 6},${v - 4},${v - 30})`
      ctx.beginPath()
      ctx.moveTo(x0 + r() * 7, y0)
      ctx.lineTo(x1, y0 + r() * 7)
      ctx.lineTo(x1 - r() * 7, y1)
      ctx.lineTo(x0, y1 - r() * 7)
      ctx.closePath()
      ctx.fill()
    }
  }
  _flag = new THREE.CanvasTexture(c)
  _flag.wrapS = _flag.wrapT = THREE.RepeatWrapping
  _flag.colorSpace = THREE.SRGBColorSpace
  _flag.anisotropy = 4
  return _flag
}

// Playful squash-and-stretch driven by the zone's last pulse time.
// Returns a ref to put on a group; `delay` staggers siblings.
export function usePlayful(zone, { delay = 0, amp = 1, sway = 0, swaySpeed = 1, phase = 0, spin = false } = {}) {
  const ref = useRef()
  const base = useRef(null)
  useFrame((state) => {
    const g = ref.current
    if (!g) return
    if (!base.current) base.current = { sx: g.scale.x, sy: g.scale.y, sz: g.scale.z, ry: g.rotation.y }
    const b = base.current
    const { pulses, hovered } = useGarden.getState()
    const t0 = pulses[zone]
    const now = performance.now()
    let sq = 0, hop = 0, turn = 0
    if (t0) {
      const t = (now - t0) / 1000 - delay
      if (t > 0 && t < 1.6) {
        const decay = Math.exp(-t * 3.2)
        sq = Math.sin(t * 16) * 0.18 * decay * amp
        hop = Math.max(0, Math.sin(Math.min(t, 0.5) * Math.PI * 2)) * 0.12 * amp * (t < 0.5 ? 1 : 0)
        if (spin) turn = (1 - Math.cos(Math.min(t / 1.2, 1) * Math.PI)) * Math.PI
      }
    }
    const hov = hovered === zone ? 1 : 0
    g.userData.hov = THREE.MathUtils.lerp(g.userData.hov || 0, hov, 0.15)
    const hs = 1 + g.userData.hov * 0.05
    g.scale.set(b.sx * hs * (1 - sq * 0.5), b.sy * hs * (1 + sq), b.sz * hs * (1 - sq * 0.5))
    g.position.y = (g.userData.y0 ?? (g.userData.y0 = g.position.y)) + hop
    const tt = state.clock.elapsedTime
    g.rotation.z = sway ? Math.sin(tt * swaySpeed + phase) * sway : g.rotation.z
    g.rotation.y = b.ry + turn
  })
  return ref
}
