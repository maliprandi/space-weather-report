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
};
