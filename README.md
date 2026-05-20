# Space Weather Dashboard 🚀🌌

A stylized operational dashboard for visualizing space weather events across the Sun–Earth–Moon-Mars system and cislunar space.

Live NASA data is rendered in a cinematic 2.5D tactical view with interactive timelines, event overlays, threat assessments, and mission tracking.

## Live Demo

🌐 [Space Weather Dashboard](https://space-weather-report.lovable.app?utm_source=chatgpt.com)

---

## Features

* ☀️ Solar flare visualization (C / M / X class)
* 🌍 Earth + Moon + cislunar operational map
* ☄️ Near-Earth Object & asteroid tracking
* 🛰️ Spacecraft & Mission overlays (ISS, Gateway, CAPSTONE, etc.)
* 🌌 Animated CME propagation toward Earth
* 📈 Scrubbable 30-day event timeline
* ⚠️ Deterministic threat-level scoring
* 🧠 Human-readable event summaries
* 🎛️ Toggleable data layers
* 🔭 Pan / zoom / parallax navigation
* 🕒 Playback controls for time simulation

---

## Data Sources

This project aggregates and visualizes data from several NASA APIs:

* NASA DONKI

  * Solar flares
  * CMEs
  * Geomagnetic storms
    
* NASA NeoWs
  * Near-Earth object close approaches

Responses are proxied through Lovable Cloud edge functions for:

* caching
* API key protection
* CORS mitigation
* rate-limit control

---

## Tech Stack

* React
* Vite
* TailwindCSS
* shadcn/ui
* Zustand
* Framer Motion
* HTML5 Canvas

---

## Core Concepts

### 2.5D Operational View

The application uses a stylized top-down renderer instead of full 3D simulation to prioritize:

* readability
* performance
* tactical clarity
* cinematic visual density

### Timeline-Driven Simulation

Animations are driven by a movable timeline cursor rather than wall-clock time.

This allows:

* replaying events
* scrubbing through CME propagation
* accelerated playback
* temporal analysis of solar activity

### Threat Heuristics

Threat levels are generated through deterministic rules:

| Event Type        | Example Logic                           |
| ----------------- | --------------------------------------- |
| Solar Flare       | X-class → High / Severe                 |
| CME               | Earth-directed + high velocity → Severe |
| Geomagnetic Storm | Kp 8–9 → Severe                         |
| Asteroid          | Large diameter + close pass → High      |

---

## Project Structure

```txt
src/
├── components/
│   ├── viewport/
│   ├── timeline/
│   └── rail/
├── data/
├── lib/
├── pages/
├── state/
└── supabase/functions/
```

---

## Development

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## Environment Variables

```env
NASA_API_KEY=your_api_key_here
```

A fallback `DEMO_KEY` may be used for development purposes.

---

## Roadmap

### v1

* NASA event visualization
* Timeline playback
* Threat heuristics
* Cislunar mission overlays

### Future Possibilities

* Real-time telemetry
* AI-generated briefings
* Push alerts
* Historical replay archives
* Full 3D orbital simulation
* Solar wind modeling

---

## Philosophy

This project is designed as an operational visualization layer between raw NASA telemetry and human intuition.

The goal is not merely to display data, but to create a spatial understanding of near-Earth space activity.

---

## Status

⚠️ Active prototype / experimental build

Not intended for mission-critical operational use.
