import { create } from 'zustand'

const initialSeason = (() => {
  try {
    const s = localStorage.getItem('mossgate-season')
    if (s === 'summer' || s === 'winter') return s
  } catch (e) {}
  return 'summer'
})()

export const useGarden = create((set, get) => ({
  season: initialSeason,
  setSeason: (season) => {
    try { localStorage.setItem('mossgate-season', season) } catch (e) {}
    set({ season })
  },
  toggleSeason: () => get().setSeason(get().season === 'summer' ? 'winter' : 'summer'),

  // the zone the hero camera is focused on (null = overview)
  selected: null,
  select: (id) => {
    set({ selected: id })
    if (id) get().pulse(id)
  },
  hovered: null,
  setHovered: (id) => set({ hovered: id }),

  // pulses[zone] = timestamp of the last "play" trigger; parts animate off it
  pulses: {},
  pulse: (id) => set((s) => ({ pulses: { ...s.pulses, [id]: performance.now() } })),

  // particle bursts the scene should spawn
  bursts: [],
  burst: (zone, point, scope = 'hero') =>
    set((s) => ({ bursts: [...s.bursts.slice(-8), { key: Math.random(), zone, point, scope, t: performance.now() }] })),
}))

// Smoothly animated season mix (0 = summer, 1 = winter), read in useFrame
// by every seasonal material without triggering React renders.
export const seasonMix = { v: initialSeason === 'winter' ? 1 : 0 }
