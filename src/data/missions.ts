// Curated cislunar mission catalog. Approximate positions for visualization only.
// x/y are in canvas units relative to Earth (Earth at 0,0). Positive x toward Moon.
export interface Mission {
  id: string;
  name: string;
  type: "leo" | "lagrange" | "lunar" | "deep";
  x: number; // px offset from Earth
  y: number;
  description: string;
  status: "active" | "planned";
}

// Earth-Moon distance maps to ~280px in canvas (see SpaceCanvas).
export const MISSIONS: Mission[] = [
  { id: "iss", name: "ISS", type: "leo", x: 14, y: -10, status: "active", description: "International Space Station — crewed laboratory in low Earth orbit." },
  { id: "tiangong", name: "Tiangong", type: "leo", x: -14, y: 10, status: "active", description: "China's crewed space station in low Earth orbit." },
  { id: "hubble", name: "HST", type: "leo", x: -18, y: -6, status: "active", description: "Hubble Space Telescope." },
  { id: "jwst", name: "JWST", type: "lagrange", x: 95, y: -50, status: "active", description: "James Webb Space Telescope, stationed at Sun–Earth L2." },
  { id: "soho", name: "SOHO", type: "lagrange", x: -120, y: 30, status: "active", description: "Solar and Heliospheric Observatory at Sun–Earth L1." },
  { id: "dscovr", name: "DSCOVR", type: "lagrange", x: -130, y: -20, status: "active", description: "Deep Space Climate Observatory at Sun–Earth L1." },
  { id: "ace", name: "ACE", type: "lagrange", x: -110, y: 50, status: "active", description: "Advanced Composition Explorer — solar wind monitor at L1." },
  { id: "capstone", name: "CAPSTONE", type: "lunar", x: 250, y: -40, status: "active", description: "Pathfinder CubeSat in a near-rectilinear halo orbit around the Moon." },
  { id: "lro", name: "LRO", type: "lunar", x: 280, y: 12, status: "active", description: "Lunar Reconnaissance Orbiter mapping the Moon." },
  { id: "gateway", name: "Gateway", type: "lunar", x: 265, y: -60, status: "planned", description: "Planned lunar Gateway station in NRHO around the Moon." },
];
