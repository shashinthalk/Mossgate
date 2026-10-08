# Mossgate Gardens — explorable 3D garden website

A React + React Three Fiber prototype for a real garden's website. The garden island
(rebuilt from the Spline scene) is the homepage centrepiece: click any place in it and the
camera flies there, the object plays a squash-and-bounce with a confetti burst, and a card
offers **See the section** (scrolls to it) or **Open page** (its own route).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## How it's put together

| Path | What it does |
| --- | --- |
| `src/data/zones.js` | **Edit content here.** The 8 places (trees, flowers, pavilion, bridge, water, fungi, rocks, hedges): copy, facts, seasonal notes, Unsplash photos, accent colours, camera focus point. Pages, sections, chips and hotspots are generated from this list. |
| `src/three/Garden.jsx` | Hero scene (camera rig, idle nudges, click zones), the per-section "pieces", lighting, season driver. |
| `src/three/parts/*` | The modelled objects: island/paths/stream, trees, pavilion & bridge, rocks/mushrooms/bushes/flowers, snow, butterflies, bursts, hotspot beacons. |
| `src/pages/` | Home (hero + sections), `/explore/:id` detail pages, `/visit`. |
| `src/index.css` | Design tokens (summer + winter palettes), layout, responsive rules. |

- **One WebGL canvas** sits behind the page; every 3D view (hero, sections, detail pages) is a drei `<View>` rendered into it, so mobile browsers never hit the WebGL context limit.
- **Summer / winter**: the toggle lerps every seasonal material, grows snow caps, hides flowers, freezes the stream, starts snowfall and swaps the UI palette. The choice is remembered in `localStorage`.
- **Mobile**: the hero doesn't capture one-finger drags (page scroll stays free); tapping still explores. The zone card turns into a bottom sheet.

## Swap in real content

1. Replace names, hours, prices and copy in `src/data/zones.js` and `src/pages/Visit.jsx`.
2. Replace the Unsplash photo ids with the garden's own photos (or keep them — they are hotlinked with credit, as Unsplash requires).
3. The garden name "Mossgate" is a placeholder — search & replace it.
