# Space Weather Dashboard — Plan

An operational dashboard that visualizes the Sun, Earth, near-Earth space, and cislunar space in a stylized 2.5D top-down view, overlaying live NASA event data with a scrubbable 30-day timeline.

## Layout

```text
+----------------------------------------------------------------------+
| TOP BAR: title · live UTC clock · "DARK-OPS / OPERATIONAL" badge     |
+-----------------------------------------------------+----------------+
|                                                     |  RIGHT RAIL    |
|                                                     |  (380px)       |
|              MAIN 2.5D VIEWPORT                     |                |
|        (pan + drag, zoom, parallax starfield)       |  Data Layers   |
|                                                     |  [x] Solar     |
|     ☀ Sun  ───►  ◐ Earth+Moon  ── L1/L2 ── Gateway  |      Flares    |
|                                                     |  [x] CMEs      |
|     (event halos, directional arrows, color nodes)  |  [x] Geomag    |
|                                                     |  [x] Asteroids |
|                                                     |  [ ] EPIC disk |
|                                                     |  [x] Missions  |
|                                                     |                |
|                                                     |  Selected      |
|                                                     |  Event Panel   |
|                                                     |  (layman ctx,  |
|                                                     |   threat lvl,  |
|                                                     |   raw NASA)    |
+-----------------------------------------------------+----------------+
| TIMELINE: 30-day scrubber, event dots color-coded, play/pause, speed |
+----------------------------------------------------------------------+
```

Left edge keeps a slim stats strip (counts per event type in current window) to match the reference screenshot's density.

## Visualization (2.5D stylized)

- HTML canvas (or SVG + CSS) top-down schematic. Sun far left, Earth center-right, Moon orbiting Earth, L1/L2/L4/L5 marked, cislunar mission markers (Artemis-class, Gateway, CAPSTONE, etc. — curated static set with approximate positions).
- Drag-to-pan, wheel-zoom. Parallax starfield + soft glow for depth.
- Event rendering:
  - **Solar flare**: pulsing halo on the Sun, color = X/M/C class.
  - **CME**: directional cone/arrow from Sun toward Earth/other target, animated travel based on `speed` + `startTime` vs current timeline cursor.
  - **Geomagnetic storm**: ring around Earth, intensity = Kp.
  - **Asteroid (NEO)**: small node on its close-approach vector to Earth, sized by diameter.
- Each event renders a clickable color-coded node → opens right-rail detail panel.

## Right Rail

- **Layer toggles** for each data type (persisted in localStorage).
- **Selected Event Panel**:
  - Top: 1–2 sentence layman summary ("A medium solar flare erupted; minor radio blackouts possible on Earth's sunlit side").
  - **Threat level** badge: None / Low / Moderate / High / Severe (heuristic).
  - Key fields surfaced (class, speed, Kp, miss distance, diameter, velocity).
  - Collapsible "Raw NASA payload" with full JSON.
  - Link out to NASA source where available.

## Timeline (bottom)

- 30-day window ending now. Scrubber cursor = "current time".
- Event dots plotted at their occurrence time, color-coded by type.
- Play / pause + speed (30m/s, 2h/s, 6h/s, 1d/s) auto-advances cursor.
- Animations on the viewport (CME travel, flare pulses) are driven by cursor time, not wall clock — scrubbing rewinds the scene.

## Data Sources (v1)

Proxied through Lovable Cloud edge functions (caches responses, hides API key, avoids CORS/rate limits):

- **NASA DONKI** — `FLR` (flares), `CME` (+ `CMEAnalysis`), `GST` (geomagnetic storms). 30-day window.
- **NASA NeoWs** — `/feed` for close approaches over the 30-day window.
- **NASA EPIC** — most recent natural-color Earth disk; rendered as Earth's texture when the EPIC layer is on.
- **Cislunar missions** — curated JSON shipped with the app (Artemis, Gateway concept, CAPSTONE, Lunar Gateway, ISS in LEO, etc.) with approximate positions / orbits. No live telemetry in v1.

## Threat Level Heuristic

Deterministic rules per type:

- **Flare**: X-class → High/Severe, M → Moderate, C → Low, B/A → None.
- **CME**: speed >2000 km/s + Earth-directed → Severe; 1000–2000 → High; <500 or not Earth-directed → Low.
- **Geomagnetic storm**: max Kp 8–9 Severe, 7 High, 6 Moderate, 5 Low.
- **Asteroid**: combine diameter and miss distance in lunar distances (LD). >140m & <1 LD → High; PHA flag bumps a level.

Layman summary text is templated from these rules — no AI call in v1 (can be upgraded later).

## Tech / Structure

- React + Vite + Tailwind + shadcn (already in stack).
- Visualization: HTML5 canvas via a small custom renderer (no heavy 3D dep). Framer Motion for UI panels.
- State: Zustand store for `{ cursorTime, layers, selectedEventId, events }`.
- Edge functions (Lovable Cloud):
  - `nasa-donki` — params: `startDate`, `endDate`, `types[]`.
  - `nasa-neows` — params: `startDate`, `endDate`.
  - `nasa-epic` — latest natural image metadata + proxied image URL.
- Caching: edge function caches each response in a `nasa_cache` table keyed by `(endpoint, params_hash)` with a TTL (15 min for DONKI/NeoWs, 1 h for EPIC).
- Secret: `NASA_API_KEY` (user-provided; DEMO_KEY fallback noted in code).

## File Plan

- `src/pages/Index.tsx` — full dashboard shell.
- `src/components/viewport/SpaceCanvas.tsx` — 2.5D renderer, pan/zoom, layer drawing.
- `src/components/viewport/bodies/*` — Sun, Earth, Moon, L-points, missions.
- `src/components/viewport/events/*` — Flare, CME, GST, NEO renderers.
- `src/components/rail/LayerToggles.tsx`, `EventDetailPanel.tsx`, `StatsStrip.tsx`.
- `src/components/timeline/Timeline.tsx` — scrubber, playback, event dots.
- `src/state/dashboardStore.ts` — Zustand store.
- `src/lib/nasa/{donki,neows,epic}.ts` — typed clients that call edge functions.
- `src/lib/threat.ts` — heuristic + layman summary templates.
- `src/data/cislunarMissions.ts` — curated mission catalog.
- `supabase/functions/nasa-donki/index.ts`, `nasa-neows/index.ts`, `nasa-epic/index.ts`.
- Migration: `nasa_cache` table.

## Build Order

1. Enable Lovable Cloud, add `NASA_API_KEY` secret, create cache table.
2. Edge functions for DONKI / NeoWs / EPIC with caching.
3. Dashboard shell + right rail + timeline (static, no events yet).
4. 2.5D canvas with bodies, pan/zoom, parallax.
5. Wire data fetching for 30-day window into Zustand store.
6. Event rendering + timeline dots + scrub-driven animation.
7. Event detail panel with threat heuristic + layman summary.
8. Cislunar missions layer.
9. Polish: glow, easings, empty/error states, loading shimmer.

## Out of Scope (v1)

- Real-time mission telemetry, true 3D, AI-generated summaries, custom date ranges beyond 30 days, multi-user state, alerts/notifications.
