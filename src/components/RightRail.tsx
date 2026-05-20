import { useDash, type LayerKey } from "@/state/dashboard";
import { THREAT_COLOR, THREAT_LABEL } from "@/lib/threat";
import { useMemo } from "react";

const LAYER_DEFS: { key: LayerKey; label: string; color: string; hint: string }[] = [
  { key: "flare", label: "Solar Flares", color: "#f97316", hint: "NASA DONKI · FLR" },
  { key: "cme", label: "Coronal Mass Ejections", color: "#eab308", hint: "NASA DONKI · CME" },
  { key: "gst", label: "Geomagnetic Storms", color: "#a78bfa", hint: "NASA DONKI · GST" },
  { key: "neo", label: "Near-Earth Objects", color: "#22d3ee", hint: "NASA NeoWs feed" },
  { key: "missions", label: "Cislunar Assets", color: "#22d3ee", hint: "Curated missions" },
  { key: "epic", label: "EPIC Earth Disk", color: "#60a5fa", hint: "NASA EPIC (TBD)" },
];

export function RightRail() {
  const { layers, toggleLayer, events, selectedId, select } = useDash();
  const selected = useMemo(() => events.find((e) => e.id === selectedId), [events, selectedId]);

  return (
    <aside className="flex h-full w-[380px] shrink-0 flex-col border-l border-cyan-950/60 bg-[#070b14] font-mono text-[11px] text-slate-300">
      <div className="border-b border-cyan-950/60 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="rounded-sm border border-cyan-700/60 px-2 py-0.5 text-[10px] tracking-[0.2em] text-cyan-300">DARK-OPS</span>
          <span className="text-[10px] tracking-widest text-slate-500">LAYERS · 6 AVAILABLE</span>
        </div>
      </div>

      <div className="border-b border-cyan-950/60 px-4 py-3">
        <div className="mb-2 text-[10px] tracking-[0.25em] text-slate-500">DATA LAYERS</div>
        <div className="space-y-1.5">
          {LAYER_DEFS.map((l) => {
            const on = layers[l.key];
            return (
              <button
                key={l.key}
                onClick={() => toggleLayer(l.key)}
                className={`flex w-full items-center justify-between border px-2 py-1.5 text-left transition ${
                  on
                    ? "border-cyan-700/60 bg-cyan-950/30 text-cyan-100"
                    : "border-slate-800 bg-transparent text-slate-500 hover:border-slate-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color, boxShadow: on ? `0 0 8px ${l.color}` : "none" }} />
                  <span className="tracking-wider">{l.label}</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-600">{on ? "ON" : "OFF"}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="mb-2 flex items-center justify-between text-[10px] tracking-[0.25em] text-slate-500">
          <span>SELECTED EVENT</span>
          {selected && (
            <button onClick={() => select(null)} className="text-slate-600 hover:text-slate-300">CLEAR ✕</button>
          )}
        </div>

        {!selected && (
          <div className="border border-dashed border-slate-800 px-3 py-6 text-center text-slate-600">
            Click any event node on the chart, or a dot on the timeline, to inspect it here.
          </div>
        )}

        {selected && (
          <div className="space-y-3">
            <div>
              <div className="text-[10px] tracking-[0.2em] text-slate-500">{selected.type.toUpperCase()}</div>
              <h3 className="mt-0.5 text-base font-semibold tracking-tight text-slate-100">{selected.title}</h3>
              <div className="mt-1 text-[10px] text-slate-500">{new Date(selected.time).toISOString().replace("T", " ").slice(0, 19)} UTC</div>
            </div>

            <div className="flex items-center gap-2 border border-slate-800 bg-black/40 px-2 py-1.5">
              <span className="text-[10px] tracking-widest text-slate-500">THREAT</span>
              <span
                className="rounded-sm px-2 py-0.5 text-[10px] font-semibold tracking-widest"
                style={{ background: THREAT_COLOR[selected.threat], color: "#0b0e16" }}
              >
                {THREAT_LABEL[selected.threat].toUpperCase()}
              </span>
            </div>

            <p className="border-l-2 border-cyan-700/60 bg-cyan-950/20 px-3 py-2 text-[12px] leading-relaxed text-cyan-50">
              {selected.layman}
            </p>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {selected.details.map(([k, v]) => (
                <div key={k} className="border-b border-slate-900/80 pb-1">
                  <dt className="text-[9px] uppercase tracking-widest text-slate-500">{k}</dt>
                  <dd className="text-[11px] text-slate-200">{v}</dd>
                </div>
              ))}
            </dl>

            <details className="border border-slate-900 bg-black/40">
              <summary className="cursor-pointer px-2 py-1 text-[10px] tracking-widest text-slate-500 hover:text-slate-300">
                RAW NASA PAYLOAD
              </summary>
              <pre className="max-h-64 overflow-auto px-2 py-2 text-[10px] leading-snug text-slate-400">
                {JSON.stringify(selected.raw, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </aside>
  );
}
