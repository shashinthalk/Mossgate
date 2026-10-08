import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { seasonMix, useGarden } from '../state/store'
import { zoneById, ZONES } from '../data/zones'
import { IslandBase, Paths, Stream } from './parts/Island'
import { TreeGrove, OakTree, PineTree } from './parts/Trees'
import { Gazebo, Bridge } from './parts/Structures'
import {
  BigRocks, StreamStones, MushroomPatch, Mushroom, Hedges, Bush, FlowerBeds, LilyPads,
  RimBlossoms, GrassTufts, Rock,
} from './parts/Nature'
import { Bursts, Butterflies, Markers, Snow } from './parts/Effects'
import { useSeasonMat } from './common'

// Events are captured on #root, so clicks on DOM controls above the canvas
// would also hit the 3D world behind them. Ignore those.
export const fromUI = (e) => {
  const t = e?.nativeEvent?.target
  return !!(t && t.closest && t.closest('button, a, input, .ui-layer'))
}

const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

/* Clickable region of the world. In the hero it focuses the camera;
   inside a section piece it just plays. */
export function Zone({ id, scope = 'hero', children }) {
  const select = useGarden((s) => s.select)
  const pulse = useGarden((s) => s.pulse)
  const burst = useGarden((s) => s.burst)
  const setHovered = useGarden((s) => s.setHovered)
  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation()
        if (fromUI(e)) return
        setHovered(id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        if (useGarden.getState().hovered === id) setHovered(null)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (fromUI(e)) return
        const p = [e.point.x, e.point.y, e.point.z]
        if (scope === 'hero') select(id)
        else pulse(id)
        burst(id, p, scope)
      }}
    >
      {children}
    </group>
  )
}

export function SeasonLights({ shadows = true, size = 11 }) {
  const sun = useRef(), hemi = useRef()
  const c = useMemo(() => ({
    sunS: new THREE.Color('#fff3df'), sunW: new THREE.Color('#e4eeff'),
    skyS: new THREE.Color('#fdfaf2'), skyW: new THREE.Color('#e3edf7'),
    gndS: new THREE.Color('#9fbf7a'), gndW: new THREE.Color('#b9c7d4'),
  }), [])
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  useFrame(() => {
    const v = seasonMix.v
    sun.current.color.copy(c.sunS).lerp(c.sunW, v)
    sun.current.intensity = 2.3 - v * 0.6
    hemi.current.color.copy(c.skyS).lerp(c.skyW, v)
    hemi.current.groundColor.copy(c.gndS).lerp(c.gndW, v)
    hemi.current.intensity = 1.15 + v * 0.25
  })
  return (
    <>
      <hemisphereLight ref={hemi} intensity={1.2} />
      <directionalLight
        ref={sun}
        position={[-9, 16, 9]}
        intensity={2.2}
        castShadow={shadows}
        shadow-mapSize={[mobile ? 1024 : 2048, mobile ? 1024 : 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-size}
        shadow-camera-right={size}
        shadow-camera-top={size}
        shadow-camera-bottom={-size}
        shadow-camera-near={1}
        shadow-camera-far={50}
      />
    </>
  )
}

export function GardenWorld({ scope = 'hero' }) {
  const deselect = useGarden((s) => s.select)
  return (
    <group>
      <group onClick={(e) => { e.stopPropagation(); if (!fromUI(e) && scope === 'hero') deselect(null) }}>
        <IslandBase />
      </group>
      <Zone id="bridge" scope={scope}>
        <Paths />
        <Bridge position={[0.46, 0, 5.4]} rotation={[0, (39 * Math.PI) / 180, 0]} />
      </Zone>
      <Zone id="water" scope={scope}>
        <Stream />
        <LilyPads />
        <StreamStones />
      </Zone>
      <Zone id="pavilion" scope={scope}>
        <Gazebo position={[-0.4, 0, -7.0]} scale={1.35} />
      </Zone>
      <Zone id="trees" scope={scope}>
        <TreeGrove />
      </Zone>
      <Zone id="rocks" scope={scope}>
        <BigRocks />
      </Zone>
      <Zone id="hedges" scope={scope}>
        <Hedges />
      </Zone>
      <Zone id="flowers" scope={scope}>
        <FlowerBeds />
        <RimBlossoms />
      </Zone>
      <Zone id="fungi" scope={scope}>
        <MushroomPatch />
      </Zone>
      <GrassTufts />
    </group>
  )
}

/* ---------------- hero ---------------- */
const OVERVIEW_TARGET = new THREE.Vector3(0, 0.6, 0.3)
const ELEV = 0.66 // radians ~38°

function overviewDistance(aspect) {
  const halfV = Math.tan(THREE.MathUtils.degToRad(17.5))
  const byHeight = 30
  const byWidth = (aspect < 1 ? 9.6 : 13.5) / (halfV * aspect)
  return Math.max(byHeight, byWidth)
}

function CameraRig() {
  const { camera, controls, size } = useThree()
  const selected = useGarden((s) => s.selected)
  const goal = useRef({ pos: new THREE.Vector3(), target: new THREE.Vector3(), until: 0, film: 0 })
  useEffect(() => {
    const aspect = size.width / size.height
    const z = selected ? zoneById[selected] : null
    const target = z ? new THREE.Vector3(...z.focus.target) : OVERVIEW_TARGET.clone()
    // tall screens: lift the island into the top half; the headline sits below it
    if (!z && aspect < 1) target.y -= 2.4
    let dist = z ? z.focus.dist * 1.8 : overviewDistance(aspect)
    if (z && aspect < 1) dist *= 1.35 / Math.max(aspect, 0.55)
    const az = z ? z.focus.az : 0
    const pos = new THREE.Vector3(
      target.x + Math.sin(az) * Math.cos(ELEV) * dist,
      target.y + Math.sin(ELEV) * dist,
      target.z + Math.cos(az) * Math.cos(ELEV) * dist
    )
    // On narrow screens the card sits at the bottom: aim a bit lower so the object rides higher.
    if (z && aspect < 1) target.y -= dist * 0.12
    // Lens shift instead of moving the target, so orbiting stays centred on the island.
    // Overview: island sits right of the headline. Focused: subject sits left of the card.
    goal.current.film = aspect >= 1.15 ? (z ? 5.5 : -Math.min(5, (aspect - 1) * 7)) : 0
    goal.current.pos.copy(pos)
    goal.current.target.copy(target)
    goal.current.until = performance.now() + 1800
    if (controls) controls.autoRotate = !z
  }, [selected, size.width, size.height, controls])
  useFrame((_, dt) => {
    if (!controls) return
    const g = goal.current
    if (Math.abs(camera.filmOffset - g.film) > 0.01) {
      camera.filmOffset += (g.film - camera.filmOffset) * (1 - Math.exp(-dt * 3))
      camera.updateProjectionMatrix()
    }
    if (performance.now() < g.until) {
      const k = 1 - Math.exp(-dt * 3.2)
      camera.position.lerp(g.pos, k)
      controls.target.lerp(g.target, k)
      controls.update()
    }
  })
  return null
}

function IdleNudge() {
  useFrame((s) => {
    const st = useGarden.getState()
    const t = s.clock.elapsedTime
    const slot = Math.floor(t / 4.5)
    if (slot !== IdleNudge.last && t > 3) {
      IdleNudge.last = slot
      if (!st.selected && !st.hovered) {
        const z = ZONES[slot % ZONES.length]
        st.pulse(z.id)
      }
    }
  })
  return null
}

export function HeroScene() {
  const fine = finePointer()
  return (
    <>
      <PerspectiveCamera makeDefault fov={35} position={[0, 14, 18]} near={0.5} far={200} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableRotate={fine}
        autoRotate
        autoRotateSpeed={0.35}
        minPolarAngle={0.45}
        maxPolarAngle={1.2}
        enableDamping
        target={[0, 0.6, 0.3]}
      />
      <CameraRig />
      <IdleNudge />
      <SeasonLights />
      <GardenWorld scope="hero" />
      <Snow />
      <Butterflies />
      <Markers />
      <Bursts scope="hero" />
    </>
  )
}

/* ---------------- section / page pieces ---------------- */
function Plinth({ r = 2.6 }) {
  const grass = useSeasonMat('#5fb534', '#eef3f6', { rough: 0.95 })
  const soil = useSeasonMat('#9a6a48', '#8f6a52', { rough: 1 })
  return (
    <group>
      <mesh receiveShadow position={[0, -0.15, 0]} material={grass}>
        <cylinderGeometry args={[r, r, 0.3, 64]} />
      </mesh>
      <mesh position={[0, -0.55, 0]} material={soil}>
        <cylinderGeometry args={[r - 0.08, r - 0.5, 0.5, 64]} />
      </mesh>
    </group>
  )
}

function PondPiece() {
  const water = useSeasonMat('#4fa6bd', '#c4e3ec', { rough: 0.15 })
  const pad = useSeasonMat('#4fb83a', '#dbe7ea', { side: THREE.DoubleSide })
  const pads = useRef()
  useFrame((s) => {
    pads.current?.children.forEach((c, i) => (c.position.y = 0.03 + Math.sin(s.clock.elapsedTime * 1.5 + i) * 0.015))
  })
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} material={water} receiveShadow>
        <circleGeometry args={[1.7, 48]} />
      </mesh>
      <group ref={pads}>
        {[[-0.6, 0.3, 0.32], [0.5, -0.4, 0.26], [0.3, 0.7, 0.22], [-0.2, -0.8, 0.2]].map(([x, z, r], i) => (
          <mesh key={i} position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, i * 1.7]} material={pad}>
            <circleGeometry args={[r, 20, 0, Math.PI * 1.78]} />
          </mesh>
        ))}
      </group>
      <Rock zone="water" position={[1.6, 0, 0.6]} size={0.7} seed={3} />
      <Rock zone="water" position={[-1.5, 0, -0.9]} size={0.55} seed={8} />
      <Rock zone="water" position={[1.2, 0, -1.3]} size={0.45} seed={12} />
    </group>
  )
}

const PIECE = {
  trees: { cam: 14.5, y: 1.7, el: () => (<><OakTree zone="trees" h={3.6} seed={4} position={[-0.4, 0, 0]} /><PineTree zone="trees" h={2.6} seed={2} position={[1.4, 0, -0.9]} delay={0.1} /></>) },
  flowers: {
    cam: 9, y: 0.1,
    el: () => (
      <FlowerBeds zone="flowers" seed={9} beds={[
        { x: -0.9, z: 0.3, s: 0.8, pal: ['#f2672e', '#f58a2c', '#e8452c'] },
        { x: 0.8, z: 0.6, s: 0.75, pal: ['#f7d23a', '#f5b82a', '#fbe36a'] },
        { x: 0.1, z: -0.8, s: 0.85, pal: ['#7fa8e8', '#a9c4f2', '#ffffff'] },
        { x: -0.3, z: 1.4, s: 0.55, pal: ['#f07aa0', '#e54b6b', '#f7a3c0'] },
        { x: 1.4, z: -0.6, s: 0.5, pal: ['#f07aa0', '#ffffff', '#f7a3c0'] },
        { x: -1.5, z: -0.7, s: 0.55, pal: ['#f7d23a', '#f2672e', '#fbe36a'] },
      ]} />
    ),
  },
  pavilion: { cam: 12.5, y: 1.2, el: () => <Gazebo zone="pavilion" scale={1.25} /> },
  bridge: { cam: 11, y: 0.4, el: () => (<><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}><planeGeometry args={[1.6, 4.9]} /><meshStandardMaterial color="#4fa6bd" roughness={0.2} /></mesh><Bridge zone="bridge" scale={0.85} /></>) },
  water: { cam: 9.5, y: 0.1, el: () => <PondPiece /> },
  fungi: { cam: 11, y: 0.6, el: () => (<><Mushroom zone="fungi" position={[0.1, 0, -0.3]} s={2.6} /><Mushroom zone="fungi" position={[-1.3, 0, 0.7]} s={1.5} delay={0.1} /><Mushroom zone="fungi" position={[1.3, 0, 0.9]} s={1.1} delay={0.2} /></>) },
  rocks: { cam: 10, y: 0.5, el: () => (<><Rock zone="rocks" size={1.9} seed={3} sy={1.2} position={[-0.5, 0, -0.3]} /><Rock zone="rocks" size={1.2} seed={11} position={[0.9, 0, 0.5]} delay={0.1} /><Rock zone="rocks" size={0.7} seed={21} position={[-0.2, 0, 1.2]} delay={0.2} /></>) },
  hedges: { cam: 9.5, y: 0.4, el: () => (<><Bush zone="hedges" s={1.1} seed={1} position={[-0.7, 0, -0.2]} /><Bush zone="hedges" s={0.9} seed={2} position={[0.8, 0, 0.1]} delay={0.08} /><Bush zone="hedges" s={0.7} seed={3} position={[0.1, 0, 1.0]} delay={0.16} /></>) },
}

export function PieceScene({ id, interactive = true, autoRotate = true }) {
  const p = PIECE[id]
  const fine = finePointer()
  return (
    <>
      <PerspectiveCamera makeDefault fov={30} position={[0, p.y + p.cam * 0.5, p.cam]} near={0.1} far={100} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableRotate={fine && interactive}
        autoRotate={autoRotate}
        autoRotateSpeed={0.9}
        minPolarAngle={0.6}
        maxPolarAngle={1.25}
        target={[0, p.y, 0]}
      />
      <SeasonLights size={4} />
      <Zone id={id} scope={`piece-${id}`}>
        <Plinth />
        {p.el()}
      </Zone>
      <Snow count={160} radius={3} height={5} size={0.07} />
      <Bursts scope={`piece-${id}`} scale={0.55} />
    </>
  )
}

/* Drives the global season mix toward the chosen season. */
export function SeasonDriver() {
  useFrame((_, dt) => {
    const goal = useGarden.getState().season === 'winter' ? 1 : 0
    seasonMix.v += (goal - seasonMix.v) * (1 - Math.exp(-dt * 2.2))
    if (Math.abs(goal - seasonMix.v) < 0.001) seasonMix.v = goal
  })
  return null
}
