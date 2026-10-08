import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSeasonMat, usePlayful } from '../common'
import { seasonMix } from '../../state/store'

function Box({ size, position, rotation, material }) {
  return (
    <mesh castShadow receiveShadow position={position} rotation={rotation} material={material}>
      <boxGeometry args={size} />
    </mesh>
  )
}

export function Gazebo({ zone = 'pavilion', ...props }) {
  const deck = useSeasonMat('#a8693e', '#d8d2cb')
  const post = useSeasonMat('#f2e6cf', '#f4efe6')
  const rail = useSeasonMat('#8a5232', '#7a5240')
  const roof = useSeasonMat('#e2553a', '#d24a35', { flat: true, rough: 0.6 })
  const roof2 = useSeasonMat('#ef6a45', '#e0583e', { flat: true, rough: 0.6 })
  const trim = useSeasonMat('#e8733f', '#e8733f')
  const lantern = useRef()
  const snow = useRef()
  const ref = usePlayful(zone, { amp: 1.1, spin: false })
  useFrame((s) => {
    const v = seasonMix.v
    if (lantern.current) lantern.current.emissiveIntensity = 0.6 + v * 1.6 + Math.sin(s.clock.elapsedTime * 2.2) * 0.25
    if (snow.current) snow.current.scale.setScalar(Math.max(0.001, v))
  })
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  const rails = [
    [0, -0.66, 1.5, 0.06],
    [-0.66, 0, 0.06, 1.5],
    [0.66, 0, 0.06, 1.5],
  ]
  return (
    <group {...props}>
      <group ref={ref}>
        <Box size={[1.6, 0.16, 1.6]} position={[0, 0.08, 0]} material={deck} />
        <Box size={[0.5, 0.06, 0.25]} position={[0, 0.03, 0.9]} material={deck} />
        {corners.map(([x, z], i) => (
          <Box key={i} size={[0.12, 1.2, 0.12]} position={[x * 0.66, 0.76, z * 0.66]} material={post} />
        ))}
        {rails.map(([x, z, w, d], i) => (
          <group key={i}>
            <Box size={[w, 0.06, d]} position={[x, 0.52 + i * 0.002, z]} material={rail} />
            {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
              <Box key={k} size={[0.04, 0.34, 0.04]} position={[x + (w > 0.1 ? k * 0.18 : 0), 0.33, z + (d > 0.1 ? k * 0.18 : 0)]} material={rail} />
            ))}
          </group>
        ))}
        <Box size={[1.68, 0.12, 1.68]} position={[0, 1.42, 0]} material={trim} />
        <Box size={[2.26, 0.05, 2.26]} position={[0, 1.5, 0]} material={trim} />
        <mesh castShadow position={[0, 1.9, 0]} rotation={[0, Math.PI / 4, 0]} material={roof}>
          <coneGeometry args={[1.63, 0.8, 4]} />
        </mesh>
        <mesh castShadow position={[0, 2.22, 0]} rotation={[0, Math.PI / 4, 0]} material={roof2}>
          <coneGeometry args={[0.85, 0.46, 4]} />
        </mesh>
        <group ref={snow} position={[0, 2.0, 0]}>
          <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[1.45, 0.68, 4]} />
            <meshStandardMaterial color="#f7fafc" roughness={0.9} flatShading />
          </mesh>
        </group>
        <mesh position={[0, 2.48, 0]}>
          <sphereGeometry args={[0.07, 12, 10]} />
          <meshStandardMaterial color="#f6c35b" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* hanging lantern */}
        <mesh position={[0, 1.18, 0]}>
          <sphereGeometry args={[0.09, 14, 12]} />
          <meshStandardMaterial ref={lantern} color="#ffd98a" emissive="#ffb547" emissiveIntensity={0.8} />
        </mesh>
        <Box size={[0.01, 0.2, 0.01]} position={[0, 1.32, 0]} material={rail} />
      </group>
    </group>
  )
}

export function Bridge({ zone = 'bridge', ...props }) {
  const L = 5.2, H = 0.55, N = 22, W = 1.3
  const plankA = useSeasonMat('#c58756', '#e7e1da')
  const plankB = useSeasonMat('#b97a4a', '#dcd5cd')
  const post = useSeasonMat('#9c6239', '#8d6046')
  const railTop = useSeasonMat('#a8693e', '#efece8')
  const ref = usePlayful(zone, { amp: 0.9 })
  const archY = (x) => H * Math.cos((x / (L / 2)) * (Math.PI / 2))
  const slope = (x) => -H * Math.sin((x / (L / 2)) * (Math.PI / 2)) * (Math.PI / 2) / (L / 2)
  const planks = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const x = -L / 2 + (i + 0.5) * (L / N)
        return { x, y: archY(x) + 0.06, rz: Math.atan(slope(x)) }
      }),
    []
  )
  const segs = useMemo(() => {
    const out = []
    for (let i = 0; i < 12; i++) {
      const x0 = -L / 2 + 0.15 + i * ((L - 0.3) / 12)
      const x1 = x0 + (L - 0.3) / 12
      const y0 = archY(x0), y1 = archY(x1)
      out.push({ x: (x0 + x1) / 2, y: (y0 + y1) / 2, len: Math.hypot(x1 - x0, y1 - y0) + 0.01, rz: Math.atan2(y1 - y0, x1 - x0) })
    }
    return out
  }, [])
  return (
    <group {...props}>
      <group ref={ref}>
        {planks.map((p, i) => (
          <Box key={i} size={[L / N - 0.03, 0.07, W]} position={[p.x, p.y, 0]} rotation={[0, 0, p.rz]} material={i % 2 ? plankA : plankB} />
        ))}
        {[-W / 2 + 0.04, W / 2 - 0.04].map((z, si) => (
          <group key={si}>
            {Array.from({ length: 9 }, (_, i) => {
              const x = -L / 2 + 0.15 + i * ((L - 0.3) / 8)
              const tall = i === 0 || i === 8 || i === 4 ? 0.72 : 0.58
              return <Box key={i} size={[0.1, tall, 0.1]} position={[x, archY(x) + 0.1 + tall / 2, z]} material={post} />
            })}
            {segs.map((s, i) => (
              <group key={i}>
                <Box size={[s.len, 0.08, 0.12]} position={[s.x, s.y + 0.72, z]} rotation={[0, 0, s.rz]} material={railTop} />
                <Box size={[s.len, 0.05, 0.05]} position={[s.x, s.y + 0.44, z]} rotation={[0, 0, s.rz]} material={post} />
              </group>
            ))}
          </group>
        ))}
        <Box size={[0.3, 0.18, W + 0.1]} position={[-L / 2 - 0.05, 0.05, 0]} material={post} />
        <Box size={[0.3, 0.18, W + 0.1]} position={[L / 2 + 0.05, 0.05, 0]} material={post} />
      </group>
    </group>
  )
}
