import { useEffect, useMemo, useRef, useState } from "react";
import { useDash } from "@/state/dashboard";
import { THREAT_COLOR } from "@/lib/threat";
import { MISSIONS } from "@/data/missions";
import type { DashEvent } from "@/lib/nasa";

const W = 1600;
const H = 900;
const SUN_X = 200;
const SUN_Y = H / 2;
const EARTH_X = 1100;
const EARTH_Y = H / 2;
const MOON_OFFSET = 280;

// Earth-Sun distance ≈ 150e6 km. CME travel: ms = (150e6 / speed) * 1000
function cmeTravelMs(speedKms?: number) {
  if (!speedKms) return 3 * 24 * 3600_000;
  return (150_000_000 / speedKms) * 1000;
}

function eventActive(ev: DashEvent, cursor: number): { active: boolean; progress: number } {
  if (ev.type === "flare") {
    const end = ev.endTime ?? ev.time + 30 * 60_000;
    const active = cursor >= ev.time && cursor <= end + 6 * 3600_000;
    return { active, progress: Math.min(1, Math.max(0, (cursor - ev.time) / Math.max(1, end - ev.time))) };
  }
  if (ev.type === "cme") {
    const dur = cmeTravelMs(ev.speed);
    const active = cursor >= ev.time && cursor <= ev.time + dur + 12 * 3600_000;
    return { active, progress: Math.min(1, Math.max(0, (cursor - ev.time) / dur)) };
  }
  if (ev.type === "gst") {
    const active = cursor >= ev.time - 6 * 3600_000 && cursor <= ev.time + 36 * 3600_000;
    return { active, progress: 0 };
  }
  // neo
  const active = cursor >= ev.time - 6 * 3600_000 && cursor <= ev.time + 6 * 3600_000;
  return { active, progress: 0 };
}

const Starfield = () => {
  const stars = useMemo(() => {
    const arr: { x: number; y: number; r: number; o: number }[] = [];
    for (let i = 0; i < 220; i++) {
      arr.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        o: 0.2 + Math.random() * 0.6,
      });
    }
    return arr;
  }, []);
  return (
    <g>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#cbd5e1" opacity={s.o} />
      ))}
    </g>
  );
};

export function SpaceCanvas() {
  const { events, cursorTime, layers, selectedId, select } = useDash();
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [scale, setScale] = useState(1);
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (!svgRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setScale((s) => Math.min(3, Math.max(0.5, s + delta)));
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = { x: e.clientX - tx, y: e.clientY - ty };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    setTx(e.clientX - dragging.current.x);
    setTy(e.clientY - dragging.current.y);
  };
  const onMouseUp = () => {
    dragging.current = null;
  };

  // Active events at cursor
  const active = events
    .map((ev) => ({ ev, ...eventActive(ev, cursorTime) }))
    .filter((x) => x.active && layers[x.ev.type]);

  const flares = active.filter((a) => a.ev.type === "flare");
  const cmes = active.filter((a) => a.ev.type === "cme");
  const gsts = active.filter((a) => a.ev.type === "gst");
  const neos = active.filter((a) => a.ev.type === "neo");

  const maxFlareThreat = flares.reduce((m, a) => {
    const order = ["none", "low", "moderate", "high", "severe"];
    return Math.max(m, order.indexOf(a.ev.threat));
  }, -1);
  const flareGlowColor = maxFlareThreat >= 0 ? THREAT_COLOR[(["none","low","moderate","high","severe"] as const)[maxFlareThreat]] : null;

  const maxGstThreat = gsts.reduce((m, a) => {
    const order = ["none", "low", "moderate", "high", "severe"];
    return Math.max(m, order.indexOf(a.ev.threat));
  }, -1);
  const gstGlowColor = maxGstThreat >= 0 ? THREAT_COLOR[(["none","low","moderate","high","severe"] as const)[maxGstThreat]] : null;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#05070d] cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="sunGrad">
            <stop offset="0%" stopColor="#fff3c4" />
            <stop offset="40%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunCore">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <radialGradient id="earthGrad">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="80%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0c1330" />
          </radialGradient>
          <radialGradient id="vignette">
            <stop offset="60%" stopColor="#05070d" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
          <Starfield />

          {/* Sun ecliptic line */}
          <line x1={SUN_X} y1={SUN_Y} x2={EARTH_X} y2={EARTH_Y} stroke="#1f2937" strokeDasharray="3 6" strokeWidth={1} />

          {/* SUN */}
          <g>
            {flareGlowColor && (
              <circle cx={SUN_X} cy={SUN_Y} r={180} fill={flareGlowColor} opacity={0.25}>
                <animate attributeName="r" values="160;220;160" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.15;0.4;0.15" dur="3s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={SUN_X} cy={SUN_Y} r={140} fill="url(#sunGrad)" opacity={0.55} />
            <circle cx={SUN_X} cy={SUN_Y} r={68} fill="url(#sunCore)" />
            <text x={SUN_X} y={SUN_Y + 110} textAnchor="middle" fill="#fbbf24" fontSize={11} fontFamily="ui-monospace,monospace" letterSpacing={3}>SUN</text>
          </g>

          {/* CMEs */}
          {cmes.map(({ ev, progress }) => {
            const angle = ((ev.angleDeg ?? 0) * Math.PI) / 180;
            const distance = 60 + progress * 900;
            const x = SUN_X + Math.cos(angle) * distance;
            const y = SUN_Y + Math.sin(angle) * distance;
            const color = THREAT_COLOR[ev.threat];
            return (
              <g key={ev.id}>
                <path
                  d={`M ${SUN_X} ${SUN_Y} L ${x} ${y}`}
                  stroke={color}
                  strokeWidth={2}
                  opacity={0.5}
                />
                <circle cx={x} cy={y} r={selectedId === ev.id ? 14 : 8} fill={color} opacity={0.9} onClick={() => select(ev.id)} className="cursor-pointer">
                  <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* arrow head */}
                <polygon
                  points={`${x},${y - 6} ${x + 12},${y} ${x},${y + 6}`}
                  fill={color}
                  transform={`rotate(${(ev.angleDeg ?? 0)} ${x} ${y})`}
                  opacity={0.85}
                />
              </g>
            );
          })}

          {/* EARTH */}
          <g>
            {gstGlowColor && (
              <circle cx={EARTH_X} cy={EARTH_Y} r={70} fill="none" stroke={gstGlowColor} strokeWidth={3} opacity={0.6}>
                <animate attributeName="r" values="60;90;60" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={EARTH_X} cy={EARTH_Y} r={48} fill="url(#earthGrad)" stroke="#3b82f6" strokeWidth={1} />
            <text x={EARTH_X} y={EARTH_Y + 72} textAnchor="middle" fill="#60a5fa" fontSize={11} fontFamily="ui-monospace,monospace" letterSpacing={3}>EARTH</text>

            {/* Moon orbit */}
            <circle cx={EARTH_X} cy={EARTH_Y} r={MOON_OFFSET} fill="none" stroke="#1e293b" strokeDasharray="2 4" />
            <circle cx={EARTH_X + MOON_OFFSET} cy={EARTH_Y} r={14} fill="#94a3b8" />
            <text x={EARTH_X + MOON_OFFSET} y={EARTH_Y + 32} textAnchor="middle" fill="#94a3b8" fontSize={9} fontFamily="ui-monospace,monospace">MOON</text>
          </g>

          {/* Lagrange points */}
          <g fontFamily="ui-monospace,monospace" fontSize={9} fill="#64748b">
            <circle cx={EARTH_X - 120} cy={EARTH_Y} r={3} fill="#64748b" />
            <text x={EARTH_X - 120} y={EARTH_Y - 8} textAnchor="middle">L1</text>
            <circle cx={EARTH_X + 120} cy={EARTH_Y} r={3} fill="#64748b" />
            <text x={EARTH_X + 120} y={EARTH_Y - 8} textAnchor="middle">L2</text>
          </g>

          {/* Missions */}
          {layers.missions &&
            MISSIONS.map((m) => (
              <g key={m.id} transform={`translate(${EARTH_X + m.x} ${EARTH_Y + m.y})`}>
                <rect x={-4} y={-4} width={8} height={8} fill={m.status === "planned" ? "transparent" : "#22d3ee"} stroke="#22d3ee" strokeWidth={1} />
                <text x={8} y={3} fill="#94a3b8" fontSize={9} fontFamily="ui-monospace,monospace">
                  {m.name}
                </text>
              </g>
            ))}

          {/* NEOs */}
          {neos.map(({ ev }) => {
            const angle = ((ev.angleDeg ?? 0) * Math.PI) / 180;
            const r = 90 + (Math.abs((ev.angleDeg ?? 0)) * 2);
            const x = EARTH_X + Math.cos(angle + Math.PI) * r;
            const y = EARTH_Y + Math.sin(angle + Math.PI) * r;
            const color = THREAT_COLOR[ev.threat];
            return (
              <g key={ev.id} onClick={() => select(ev.id)} className="cursor-pointer">
                <line x1={x} y1={y} x2={EARTH_X} y2={EARTH_Y} stroke={color} strokeWidth={0.8} opacity={0.5} strokeDasharray="2 3" />
                <circle cx={x} cy={y} r={selectedId === ev.id ? 9 : 5} fill={color} stroke="#fff" strokeWidth={selectedId === ev.id ? 1 : 0} />
              </g>
            );
          })}

          {/* Flare clickable nodes (small) */}
          {flares.map(({ ev }, i) => {
            const offsetAngle = (i / Math.max(1, flares.length)) * Math.PI * 2;
            const r = 90;
            const x = SUN_X + Math.cos(offsetAngle) * r;
            const y = SUN_Y + Math.sin(offsetAngle) * r;
            const color = THREAT_COLOR[ev.threat];
            return (
              <circle
                key={ev.id}
                cx={x}
                cy={y}
                r={selectedId === ev.id ? 8 : 5}
                fill={color}
                stroke="#fff"
                strokeWidth={selectedId === ev.id ? 1 : 0}
                onClick={() => select(ev.id)}
                className="cursor-pointer"
              />
            );
          })}

          {/* GST nodes orbiting earth */}
          {gsts.map(({ ev }, i) => {
            const a = (i / Math.max(1, gsts.length)) * Math.PI * 2;
            const r = 85;
            const x = EARTH_X + Math.cos(a) * r;
            const y = EARTH_Y + Math.sin(a) * r;
            const color = THREAT_COLOR[ev.threat];
            return (
              <circle
                key={ev.id}
                cx={x}
                cy={y}
                r={selectedId === ev.id ? 8 : 5}
                fill={color}
                stroke="#fff"
                strokeWidth={selectedId === ev.id ? 1 : 0}
                onClick={() => select(ev.id)}
                className="cursor-pointer"
              />
            );
          })}

          <rect x={0} y={0} width={W} height={H} fill="url(#vignette)" pointerEvents="none" />
        </g>
      </svg>

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-4 flex gap-1 font-mono text-xs">
        <button
          onClick={() => setScale((s) => Math.min(3, s + 0.2))}
          className="border border-cyan-900 bg-black/60 px-2 py-1 text-cyan-300 hover:bg-cyan-950"
        >
          +
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
          className="border border-cyan-900 bg-black/60 px-2 py-1 text-cyan-300 hover:bg-cyan-950"
        >
          −
        </button>
        <button
          onClick={() => { setScale(1); setTx(0); setTy(0); }}
          className="border border-cyan-900 bg-black/60 px-3 py-1 text-cyan-300 hover:bg-cyan-950 tracking-widest"
        >
          RESET VIEW
        </button>
      </div>
    </div>
  );
}
