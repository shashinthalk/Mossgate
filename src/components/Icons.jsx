const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const Sun = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
)
export const Snowflake = (p) => (
  <svg {...base} {...p}><path d="M12 2v20M4.2 7l15.6 10M4.2 17l15.6-10M9 4l3 2 3-2M9 20l3-2 3 2M3.5 10.5l3.2.8-.8 3.2M20.5 13.5l-3.2-.8.8-3.2" /></svg>
)
export const Arrow = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const ArrowDown = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M6 13l6 6 6-6" /></svg>
)
export const Close = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
)
export const Chevron = ({ dir = 'right', ...p }) => (
  <svg {...base} {...p}>{dir === 'right' ? <path d="M9 6l6 6-6 6" /> : <path d="M15 6l-6 6 6 6" />}</svg>
)
export const Leaf = (p) => (
  <svg {...base} {...p}><path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z" /><path d="M5 19c3-4 6-7 10-9" /></svg>
)
export const Hand = (p) => (
  <svg {...base} {...p}><path d="M9 11V5a1.5 1.5 0 0 1 3 0v5M12 10V4a1.5 1.5 0 0 1 3 0v6M15 10V6a1.5 1.5 0 0 1 3 0v7a7 7 0 0 1-7 7h-.5A6.5 6.5 0 0 1 5 15.5L4 12a1.5 1.5 0 0 1 2.6-1.4L9 13" /></svg>
)
export const Menu = (p) => (
  <svg {...base} {...p}><path d="M4 8h16M4 16h16" /></svg>
)
