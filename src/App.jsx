import { Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import * as THREE from 'three'
import { useGarden } from './state/store'
import { SeasonDriver } from './three/Garden'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import ZonePage from './pages/ZonePage'
import Visit from './pages/Visit'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) return void setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function SeasonAttr() {
  const season = useGarden((s) => s.season)
  useEffect(() => {
    document.documentElement.dataset.season = season
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', season === 'winter' ? '#e9eff4' : '#f3efe6')
  }, [season])
  return null
}

export default function App() {
  return (
    <>
      <SeasonAttr />
      <ScrollManager />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore/:id" element={<ZonePage />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      {/* One WebGL canvas behind the page; every 3D view on the site renders into it. */}
      <Canvas
        className="gl-canvas"
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        <SeasonDriver />
        <Suspense fallback={null}>
          <View.Port />
        </Suspense>
      </Canvas>
    </>
  )
}
