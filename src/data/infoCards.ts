export interface InfoCard {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  details: [string, string][];
}

export const INFO_CARDS: Record<string, InfoCard> = {
  "van-allen-inner": {
    id: "van-allen-inner",
    category: "RADIATION BELT",
    title: "Inner Van Allen Belt",
    subtitle: "Earth's inner radiation belt — high-energy protons",
    description:
      "The inner Van Allen belt is a doughnut-shaped region of energetic charged particles trapped by Earth's magnetic field. It's dominated by high-energy protons (and some electrons) produced largely by cosmic-ray albedo neutron decay. The belt is dense, stable, and a serious hazard for crewed spaceflight, electronics, and sensors that linger inside it.",
    details: [
      ["Altitude", "≈ 1,000 – 6,000 km (0.2 – 2 R⊕)"],
      ["Dominant particle", "Protons up to ~400 MeV"],
      ["Proton flux", "≈ 10⁴ – 10⁵ /cm²·s (>10 MeV)"],
      ["Electron flux", "≈ 10⁶ – 10⁸ /cm²·s (>40 keV)"],
      ["Peak dose rate", "≈ 10 – 100 mGy/day inside SAA"],
      ["Discovered", "1958 · Explorer 1 / 3 (J. Van Allen)"],
      ["Notable feature", "South Atlantic Anomaly (SAA) dip"],
      ["Hazard", "Single-event upsets, sensor degradation"],
    ],
  },
  "van-allen-outer": {
    id: "van-allen-outer",
    category: "RADIATION BELT",
    title: "Outer Van Allen Belt",
    subtitle: "Earth's outer radiation belt — relativistic electrons",
    description:
      "The outer Van Allen belt is dominated by relativistic ('killer') electrons accelerated by interactions between the solar wind and Earth's magnetosphere. Unlike the inner belt, it is highly dynamic — fluxes can change by orders of magnitude within hours during geomagnetic storms, threatening GEO satellites and any spacecraft transiting through it.",
    details: [
      ["Altitude", "≈ 13,000 – 60,000 km (3 – 10 R⊕)"],
      ["Dominant particle", "Electrons 0.1 – 10 MeV"],
      ["Electron flux", "≈ 10⁵ – 10⁷ /cm²·s (>1 MeV)"],
      ["Variability", "Up to 1000× within hours (storms)"],
      ["Peak dose rate", "≈ 1 – 10 Gy/day (unshielded)"],
      ["Slot region", "≈ 7,000 – 13,000 km (low flux gap)"],
      ["Discovered", "1958 · Pioneer 3 (Van Allen)"],
      ["Hazard", "Deep dielectric charging at GEO"],
    ],
  },
  sun: {
    id: "sun",
    category: "STAR · G2V",
    title: "The Sun",
    subtitle: "Main-sequence yellow dwarf at the heart of the Solar System",
    description:
      "The Sun is a 4.6-billion-year-old G-type main-sequence star fusing hydrogen into helium in its core at ~15 million K. It contains 99.86% of the Solar System's mass and drives space weather across the heliosphere via the solar wind, coronal mass ejections, and flares. Its 11-year magnetic activity cycle modulates sunspot counts, flare frequency, and the heliospheric current sheet.",
    details: [
      ["Mass", "1.989 × 10³⁰ kg (333,000 M⊕)"],
      ["Radius", "695,700 km (109 R⊕)"],
      ["Surface gravity", "274 m/s² (28× Earth)"],
      ["Luminosity", "3.828 × 10²⁶ W"],
      ["Surface temp", "5,778 K (photosphere)"],
      ["Core temp", "≈ 15.7 million K"],
      ["Composition", "~73% H, ~25% He, <2% O/C/Fe/Ne"],
      ["Rotation", "25 d equator · 35 d poles"],
      ["Activity cycle", "~11 years (Schwabe cycle)"],
      ["Age", "≈ 4.6 billion years"],
    ],
  },
  earth: {
    id: "earth",
    category: "PLANET · TERRESTRIAL",
    title: "Earth",
    subtitle: "Third planet — the only known world hosting life",
    description:
      "Earth is the densest planet in the Solar System and the only one with confirmed surface liquid water and an oxygen-rich atmosphere. Its active plate tectonics, strong dipole magnetic field, and the stabilizing influence of the Moon make it uniquely habitable. The magnetosphere deflects most solar-wind plasma and traps energetic particles in the Van Allen belts.",
    details: [
      ["Mass", "5.972 × 10²⁴ kg"],
      ["Radius", "6,371 km (mean)"],
      ["Surface gravity", "9.807 m/s² (1 g)"],
      ["Distance from Sun", "1.000 AU (149.6 M km)"],
      ["Orbital period", "365.25 days"],
      ["Rotation period", "23h 56m 4s (sidereal)"],
      ["Surface temp", "−88 to +58 °C (mean 15 °C)"],
      ["Atmosphere", "78% N₂, 21% O₂, 0.93% Ar, 0.04% CO₂"],
      ["Crust composition", "O, Si, Al, Fe, Ca, Na, K, Mg"],
      ["Magnetic field", "≈ 25–65 µT (dipole, ~0.3 G surface)"],
      ["Natural satellites", "1 (Moon)"],
    ],
  },
  moon: {
    id: "moon",
    category: "NATURAL SATELLITE",
    title: "The Moon",
    subtitle: "Earth's only natural satellite — Artemis target body",
    description:
      "The Moon is the fifth-largest natural satellite in the Solar System and the only celestial body other than Earth visited by humans. Formed ~4.5 Gyr ago — most likely from a giant impact between proto-Earth and a Mars-sized body (Theia) — it is tidally locked to Earth. Permanently shadowed polar craters host water-ice deposits that are a primary target for Artemis-era in-situ resource utilization.",
    details: [
      ["Mass", "7.342 × 10²² kg (0.0123 M⊕)"],
      ["Radius", "1,737 km (0.273 R⊕)"],
      ["Surface gravity", "1.62 m/s² (0.165 g)"],
      ["Mean distance from Earth", "384,400 km (0.0026 AU)"],
      ["Orbital period", "27.32 days (sidereal)"],
      ["Rotation", "Tidally locked (synchronous)"],
      ["Surface temp", "−173 to +127 °C"],
      ["Atmosphere", "Negligible exosphere (≈ 10⁻¹⁵ bar)"],
      ["Regolith composition", "O, Si, Fe, Ca, Al, Mg, Ti (basalt/anorthosite)"],
      ["Water ice", "Confirmed in PSRs near both poles"],
      ["Magnetic field", "None global; localized crustal anomalies"],
    ],
  },
  mars: {
    id: "mars",
    category: "PLANET · TERRESTRIAL",
    title: "Mars",
    subtitle: "Fourth planet — primary target for crewed exploration",
    description:
      "Mars is a cold desert world with a thin CO₂ atmosphere, polar ice caps, and abundant evidence of past liquid water — ancient river valleys, deltas, and hydrated minerals. It hosts the Solar System's tallest volcano (Olympus Mons, ~22 km) and largest canyon (Valles Marineris, ~4,000 km long). With no global magnetic field, surface radiation is a major challenge for future crews.",
    details: [
      ["Mass", "6.417 × 10²³ kg (0.107 M⊕)"],
      ["Radius", "3,389 km (0.532 R⊕)"],
      ["Surface gravity", "3.71 m/s² (0.379 g)"],
      ["Distance from Sun", "1.524 AU (227.9 M km)"],
      ["Orbital period", "687 Earth days (1.88 yr)"],
      ["Rotation period", "24h 37m (sol)"],
      ["Surface temp", "−143 to +35 °C (mean −63 °C)"],
      ["Atmosphere", "95% CO₂, 2.8% N₂, 2% Ar (≈ 6 mbar)"],
      ["Surface composition", "Basalt, iron oxides, hydrated silicates, perchlorates"],
      ["Water", "Polar ice caps + subsurface ice & brines"],
      ["Magnetic field", "No global; crustal remnants in southern hemisphere"],
      ["Natural satellites", "2 (Phobos, Deimos)"],
    ],
  },
};
