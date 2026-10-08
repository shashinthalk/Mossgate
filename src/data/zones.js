// Every explorable place in the garden. The 3D world, the homepage sections
// and the detail pages are all generated from this one list.

export const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`

const photo = (id, author, slug, alt) => ({
  id,
  author,
  link: `https://unsplash.com/photos/${slug}?utm_source=mossgate_gardens&utm_medium=referral`,
  alt,
})

export const GARDEN = {
  name: 'Mossgate Gardens',
  tagline: 'A garden to wander, season after season.',
  hours: { summer: '08:00 – 20:00', winter: '09:00 – 16:30' },
  address: 'Mossgate Lane 12, Riverside',
}

export const ZONES = [
  {
    id: 'trees',
    title: 'The Arboretum',
    kicker: 'Trees',
    blurb: 'Old oaks, a red-leaf maple and evergreen pines that have watched over the garden for decades.',
    body: 'Our arboretum is the oldest corner of Mossgate. Two broad oaks anchor the western lawn, a slender Italian cypress stands sentinel by the stream, and a pair of pines keep the garden green through the darkest months. The Japanese maple by the east path is the most photographed tree we have — its leaves start crimson and stay that way all summer.',
    facts: [
      ['Species', '42'],
      ['Oldest oak', '~180 yrs'],
      ['Tallest pine', '24 m'],
      ['Tree walks', 'Sat · 10:00'],
    ],
    highlights: ['English oak (Quercus robur)', 'Japanese maple ‘Bloodgood’', 'Scots pine pair', 'Italian cypress', 'Guided canopy walk'],
    seasonal: {
      summer: 'Deep shade under the oaks, and the maple at its reddest. Bring a blanket — the western lawn is the coolest spot in the garden.',
      winter: 'Bare branches reveal the oaks’ architecture. The pines carry snow beautifully — come on a still morning after snowfall.',
    },
    accent: '#3f7d3a',
    burst: ['#7dc843', '#5fae35', '#e7643f', '#f2c14e'],
    focus: { target: [-4.4, 1.6, -4.8], dist: 10.5, az: -0.25 },
    marker: [-6.9, 3.9, -4.8],
    images: [
      photo('1774918954112-7dd953c45558', 'Adam Kring', 'a-large-ancient-oak-tree-with-sprawling-branches-onpoY1_ar24', 'An ancient oak tree with sprawling branches'),
      photo('1761419772686-6d23f48ee973', 'Jill Xue', 'majestic-oak-trees-with-sprawling-branches-in-a-sunny-park-y0kYSEGNxhA', 'Oak trees in a sunny park'),
      photo('1534125981653-62348ecf8b92', 'Jeff Ma', 'selective-photo-of-orange-maple-leafed-UnJPdLmjQXY', 'Orange maple leaves'),
      photo('1685284711113-52012745af41', 'Viktor Solomonik', 'a-bench-sitting-under-a-tree-in-a-park-NNvC0ypMQKo', 'A bench beneath a tree'),
      photo('1605169283429-8a9d78313a01', 'Na visky', 'red-and-yellow-maple-leaves-O5z3iX5uaNI', 'Red and yellow maple leaves'),
    ],
  },
  {
    id: 'flowers',
    title: 'Flower Meadows',
    kicker: 'Flowers',
    blurb: 'Twenty-eight beds of dahlias, cosmos, marigolds and cornflowers that bloom in waves from May to October.',
    body: 'The meadows are planted so something is always opening. Spring belongs to bulbs, early summer to cornflowers and cosmos, late summer to dahlias and marigolds. Each bed is hand-weeded and planted without peat, and every flower here is chosen to feed pollinators as much as to please the eye.',
    facts: [
      ['Flower beds', '28'],
      ['Varieties', '160+'],
      ['Peak bloom', 'Jul – Aug'],
      ['Pollinator-safe', '100%'],
    ],
    highlights: ['Dahlia border', 'White cosmos drift', 'Cornflower & poppy bed', 'Marigold edging', 'Monthly bloom calendar'],
    seasonal: {
      summer: 'The meadows at full volume — dahlias, cosmos and marigolds, with butterflies on every bed.',
      winter: 'Beds rest under mulch and snow. Seed heads are left standing for the birds; the greenhouse tour runs instead.',
    },
    accent: '#d9653b',
    burst: ['#f2672e', '#f7d23a', '#f07aa0', '#7fa8e8', '#ffffff'],
    focus: { target: [-3.6, 0.3, 1.8], dist: 8.5, az: -0.35 },
    marker: [-4.9, 1.4, 2.5],
    images: [
      photo('1533907650686-70576141c030', 'Irina Iriser', 'selective-focus-photo-of-pink-petaled-flowers-mNz9Pa3tz34', 'Pink dahlias at sunset'),
      photo('1548386135-9002f96a0dc4', 'MIO ITO', 'field-of-flowers-tYNLwRxFsQc', 'A field of flowers'),
      photo('1737740439064-bd1e9b041677', 'sandy', 'a-bunch-of-flowers-that-are-in-the-grass-dKQCACOf7VQ', 'White garden cosmos'),
      photo('1524696465145-27f3e2c31352', 'Aziz Acharki', 'shallow-focus-photo-of-orange-flower-y8VJIzxxsIM', 'An orange flower'),
      photo('1595672049786-43da1581214c', 'Joydeep Pal', 'purple-and-red-flower-field-during-daytime-i6kccimZz_8', 'A purple and red flower field'),
    ],
  },
  {
    id: 'pavilion',
    title: 'The Red Pavilion',
    kicker: 'Pavilion & Events',
    blurb: 'Our timber pavilion at the head of the garden — for quiet afternoons, small concerts and garden weddings.',
    body: 'Built from larch and finished with a hand-tiled red roof, the pavilion sits at the highest point of the garden so you can see every path from its rail. It seats forty for ceremonies, hosts the summer music evenings and is free to sit in whenever it isn’t booked.',
    facts: [
      ['Seats', '40'],
      ['Built', '1998'],
      ['Music evenings', 'Fri · Jun–Aug'],
      ['Ceremonies', 'Apr – Oct'],
    ],
    highlights: ['Garden ceremonies', 'Summer music evenings', 'Private hire', 'Lantern nights in December'],
    seasonal: {
      summer: 'Music every Friday at dusk, and the pavilion is booked most Saturdays for ceremonies.',
      winter: 'Strung with lanterns for the December evening openings — mulled cider at the rail.',
    },
    accent: '#c8462f',
    burst: ['#e2553a', '#f6c35b', '#f2e6cf', '#ef6a45'],
    focus: { target: [-0.4, 1.3, -7.0], dist: 7.5, az: 0.05 },
    marker: [-0.4, 3.9, -7.0],
    images: [
      photo('1675328658569-18baaaae3aca', 'Blunimo Digital', 'a-gazebo-sitting-in-the-middle-of-a-lush-green-park-gRIMoQTIqBY', 'A gazebo in a lush park'),
      photo('1723641580209-919d71934d43', 'Deborah Downes', 'a-white-gazebo-surrounded-by-trees-and-flowers-SW6mo5ReCUY', 'A white gazebo among flowers'),
      photo('1777119846462-01c9a4468fa6', 'Declan Sun', 'white-gazebo-with-glass-roof-surrounded-by-trees-k8rY8gbmr4c', 'A white gazebo with a glass roof'),
      photo('1593094351780-1c33566159ef', 'Lisa Yount', 'white-and-blue-wooden-house-surrounded-by-green-trees-during-daytime-4Em3ufS6-ZU', 'A garden gazebo among trees'),
    ],
  },
  {
    id: 'bridge',
    title: 'Bridge & Trails',
    kicker: 'Paths',
    blurb: 'Two kilometres of flagstone paths, all joined by the arched footbridge over the stream.',
    body: 'Every path at Mossgate is laid in reclaimed sandstone and built step-free. The loop trail takes about twenty-five minutes at an easy pace and crosses the stream on our arched oak footbridge — the best spot in the garden to watch the water.',
    facts: [
      ['Path length', '2.1 km'],
      ['Loop walk', '25 min'],
      ['Step-free', 'Yes'],
      ['Bridge span', '10 m'],
    ],
    highlights: ['Step-free loop trail', 'Arched oak footbridge', 'Stroller & wheelchair friendly', 'Benches every 150 m'],
    seasonal: {
      summer: 'Shade most of the way round. The bridge is lovely in the late-evening light.',
      winter: 'Paths are cleared and gritted by 9:00. Frost on the bridge rails is worth an early start.',
    },
    accent: '#a8693e',
    burst: ['#c58756', '#ece0c4', '#b97a4a', '#f6dcb0'],
    focus: { target: [0.46, 0.5, 5.4], dist: 7.5, az: 0.3 },
    marker: [0.46, 2.4, 5.4],
    images: [
      photo('1607744560278-f1952f0f1db4', 'Adam Littman Davis', 'brown-wooden-bridge-over-river-IaM6Jy5Dti4', 'A wooden bridge in a Japanese garden'),
      photo('1644157393625-ad289a213e8e', 'Grant Durr', 'a-wooden-bridge-over-a-small-stream-in-a-forest-JlIWEgEVeGE', 'A wooden bridge over a forest stream'),
      photo('1773423682273-90216a43d63d', 'Sergej', 'wooden-bridge-over-a-small-stream-in-a-park-6yvdMh9yr_s', 'A wooden bridge in a park'),
      photo('1784641337283-205012542795', 'James Read', 'narrow-pathway-through-green-hedges-leading-to-a-distant-gate-j0DBP_Xe-MY', 'A path between green hedges'),
    ],
  },
  {
    id: 'water',
    title: 'The Water Garden',
    kicker: 'Stream & Lilies',
    blurb: 'A spring-fed stream that winds through the garden, with lily pads, stepping stones and dragonflies.',
    body: 'The stream rises from a spring under the pavilion and runs the whole length of the garden before leaving through the southern rim. It is planted with water lilies and marginal irises and kept chemical-free, which is why it is home to frogs, newts and four species of dragonfly.',
    facts: [
      ['Stream length', '140 m'],
      ['Lily species', '6'],
      ['Dragonflies', '4 species'],
      ['Pond dipping', 'Sun · 11:00'],
    ],
    highlights: ['Water lilies (Jun–Sep)', 'Stepping-stone crossing', 'Dragonfly watch', 'Family pond dipping'],
    seasonal: {
      summer: 'Lilies open by late morning. Dragonflies are most active on warm afternoons.',
      winter: 'The shallows freeze into glassy pools — the stream keeps running underneath.',
    },
    accent: '#3f8fa6',
    burst: ['#68b3c2', '#d8f3f6', '#4fb83a', '#f5a3c4'],
    focus: { target: [-0.3, 0.1, 0.4], dist: 10, az: 0.1 },
    marker: [-0.1, 1.2, -0.8],
    images: [
      photo('1541354254661-adb801adb23e', 'Orkhan Farmanli', 'waterlilies-during-daytime-BekDDAMRdTY', 'Water lilies in a botanical garden'),
      photo('1562569378-e991a45e258d', 'Blaz Erzetic', 'green-lily-pads-on-water-FCfFf1K7voo', 'Green lily pads on water'),
      photo('1668528104403-b8d894acdfc2', 'Luyao Wu', 'pink-flowers-floating-on-water-owfiT5DtXE0', 'Pink water lilies in late summer'),
      photo('1769506354923-273b023fe62f', 'panpan ma', 'a-clear-stream-flows-through-a-mossy-garden-with-trees-1Y7mJ1jf5FI', 'A clear stream through a mossy garden'),
    ],
  },
  {
    id: 'fungi',
    title: 'Fungi Glade',
    kicker: 'Mushrooms',
    blurb: 'A damp, shady corner where fly agarics and other woodland fungi push up through the leaf litter.',
    body: 'We leave fallen wood where it lands in the glade, and the fungi have rewarded us. Fly agaric appears every autumn under the birches, along with honey fungus, puffballs and turkey tail. Our autumn fungi walks are led by a local mycologist. Look closely, but please don’t pick.',
    facts: [
      ['Recorded species', '57'],
      ['Best months', 'Sep – Nov'],
      ['Fungi walks', 'Oct · Sun'],
      ['Picking', 'Not allowed'],
    ],
    highlights: ['Fly agaric (Amanita muscaria)', 'Turkey tail on fallen oak', 'Autumn fungi walks', 'Kids’ spotter sheet'],
    seasonal: {
      summer: 'Quiet season for fungi — look for bracket fungi on the old logs and moss carpets after rain.',
      winter: 'Velvet shank fruits even in frost. The glade is at its most atmospheric under snow.',
    },
    accent: '#c7372f',
    burst: ['#e3392f', '#ffffff', '#f6f0e2', '#f2a65a'],
    focus: { target: [-4.6, 0.3, -1.6], dist: 4.5, az: -0.3 },
    marker: [-4.5, 1.6, -2.5],
    images: [
      photo('1604238017318-427fd23dc7de', 'Thomas Bormans', 'red-and-white-mushroom-in-forest-during-daytime-ZtM-W-3f0C4', 'A red and white mushroom'),
      photo('1760352228334-bed823f362a1', 'Ingmar', 'a-single-red-and-white-mushroom-in-autumn-forest-xxemhVfraEw', 'A red and white mushroom in an autumn forest'),
      photo('1572611679880-3d45fb12188c', 'Sebastian Herrmann', 'selective-focus-photography-of-red-and-white-mushroom-pwkwtmtvCXg', 'A fly agaric close-up'),
      photo('1724041450314-489224ebfce2', 'Martin Podsiad', 'a-group-of-small-orange-mushrooms-on-the-ground-j4Jr-EfvaPA', 'Small orange mushrooms'),
    ],
  },
  {
    id: 'rocks',
    title: 'Rock Garden',
    kicker: 'Stone & Moss',
    blurb: 'Granite boulders, raked gravel and alpine plants on the sunny east side of the garden.',
    body: 'The boulders were moved here from a nearby quarry when the garden was laid out, and each one was placed by hand. Around them grow alpines, sedums and mosses that love the dry, bright east slope. It’s a slow garden — come here to sit, not to walk.',
    facts: [
      ['Boulders', '21'],
      ['Alpine species', '90+'],
      ['Heaviest stone', '6 t'],
      ['Sunniest spot', 'East slope'],
    ],
    highlights: ['Granite boulder field', 'Alpine & sedum beds', 'Moss terraces', 'Quiet seating stones'],
    seasonal: {
      summer: 'Alpines flower in tight cushions between the stones; the boulders hold the day’s warmth into the evening.',
      winter: 'Snow-capped stones and frosted moss — the most graphic part of the garden in winter.',
    },
    accent: '#7d8079',
    burst: ['#cfcfc9', '#b9bab4', '#7dc843', '#ffffff'],
    focus: { target: [5.6, 0.8, 0.2], dist: 8.5, az: 0.45 },
    marker: [5.6, 2.6, 2.65],
    images: [
      photo('1786779504010-7bc313df9d10', 'Eva Balogh', 'rocks-in-raked-gravel-garden-nWak3jYopd8', 'Mossy islands with rocks in raked gravel'),
      photo('1786551282076-cdaeef08a634', 'Stefan Szankowski', 'rocks-in-raked-gravel-zen-garden-SKeMpFT885w', 'Rocks in a raked-gravel zen garden'),
      photo('1770018897005-abf148d713a8', 'Balázs Gábor', 'stepping-stones-cross-a-dark-water-feature-in-a-garden-WNLepoqwHeg', 'Stepping stones across dark water'),
      photo('1777989194494-3151cc1a9a2c', 'Sung Jin Cho', 'zen-garden-path-with-tree-and-distant-water-view-HhKyG7oHd74', 'A zen garden path'),
    ],
  },
  {
    id: 'hedges',
    title: 'Hedge Walk',
    kicker: 'Hedges & Shrubs',
    blurb: 'Clipped box, yew and hornbeam that frame the stream’s source and give the garden its shape.',
    body: 'The hedges are the garden’s architecture. A curve of clipped shrubs shelters the spring behind the pavilion, and looser rounded shrubs scatter across the lawns. They’re cut by hand twice a year. Ask at the gate about the topiary workshop.',
    facts: [
      ['Hedging', '380 m'],
      ['Clipped', '2× / year'],
      ['Nesting birds', '14 species'],
      ['Topiary class', 'May & Sep'],
    ],
    highlights: ['Box & yew curve', 'Hornbeam tunnel', 'Bird nesting season walks', 'Topiary workshop'],
    seasonal: {
      summer: 'Fresh growth before the August clip — the hedges hum with bees.',
      winter: 'Snow settles on the flat tops in perfect lines. Evergreen box keeps the structure all season.',
    },
    accent: '#4f8a3a',
    burst: ['#4f9e34', '#62b23f', '#3f9a2e', '#d9f2c4'],
    focus: { target: [-1.3, 0.4, -5.2], dist: 7, az: -0.15 },
    marker: [-1.6, 1.6, -5.5],
    images: [
      photo('1777539638731-162153332dc5', 'Sergej', 'a-green-hedge-lined-pathway-with-a-tree-TTKtJvCDaCo', 'A hedge-lined pathway'),
      photo('1669639938568-cd6cebb71c9d', 'Simon Wiedensohler', 'a-path-through-a-forest-Vwn22__EsFs', 'A botanic garden path'),
      photo('1709055022660-46f701fe6be2', 'James Smith', 'a-park-bench-sitting-on-the-side-of-a-road-tMTpF97Han8', 'A park bench beside hedges'),
      photo('1766837774550-75035255593a', 'Alinson torres', 'snowy-pathway-lined-with-trees-and-hedges-vZWTK2d1MEM', 'A snowy pathway lined with hedges'),
    ],
  },
]

export const WINTER_IMAGES = [
  photo('1768682975858-8f38705d834e', 'Antje Winkler', 'snow-covered-park-with-bare-trees-and-a-winding-path-NsjtGzGmZ40', 'A snow-covered park with a winding path'),
  photo('1763910797095-15c58b7e2e49', 'Stanisław Lul', 'snowy-path-through-a-winter-forest-k6tMfAecBzs', 'A snowy path through a winter forest'),
  photo('1789975935084-1b45db853e54', 'Nino Korkelia', 'trimmed-evergreen-bush-in-snowy-park-tYPtrPTvdCQ', 'A trimmed evergreen bush in a snowy park'),
]

export const zoneById = Object.fromEntries(ZONES.map((z) => [z.id, z]))
