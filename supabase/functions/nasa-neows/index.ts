import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const NASA_KEY = Deno.env.get("NASA_API_KEY") ?? "DEMO_KEY";
const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TTL_MIN = 30;

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}
function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function cachedFetch(supabase: any, key: string, url: string) {
  const { data: cached } = await supabase
    .from("nasa_cache")
    .select("payload, expires_at")
    .eq("cache_key", key)
    .maybeSingle();
  if (cached && new Date(cached.expires_at) > new Date()) return cached.payload;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`NeoWs ${r.status}: ${await r.text()}`);
  const payload = await r.json();
  const expires = new Date(Date.now() + TTL_MIN * 60_000).toISOString();
  await supabase.from("nasa_cache").upsert({
    cache_key: key,
    endpoint: "neo/feed",
    payload,
    fetched_at: new Date().toISOString(),
    expires_at: expires,
  });
  return payload;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const u = new URL(req.url);
    const startDate = u.searchParams.get("startDate")!;
    const endDate = u.searchParams.get("endDate")!;
    if (!startDate || !endDate) {
      return new Response(JSON.stringify({ error: "startDate and endDate required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(SB_URL, SB_SRK);
    // Chunk into 7-day windows (NeoWs API limit)
    const merged: Record<string, any[]> = {};
    let cursor = new Date(startDate + "T00:00:00Z");
    const final = new Date(endDate + "T00:00:00Z");
    while (cursor <= final) {
      const chunkEnd = addDays(cursor, 6) > final ? final : addDays(cursor, 6);
      const s = iso(cursor);
      const e = iso(chunkEnd);
      const key = `neows:${s}:${e}`;
      const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${s}&end_date=${e}&api_key=${NASA_KEY}`;
      const data = await cachedFetch(supabase, key, url);
      const byDate = data?.near_earth_objects ?? {};
      for (const [day, list] of Object.entries(byDate)) {
        merged[day] = list as any[];
      }
      cursor = addDays(chunkEnd, 1);
    }
    return new Response(JSON.stringify({ near_earth_objects: merged }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
