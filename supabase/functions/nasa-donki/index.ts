import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const NASA_KEY = Deno.env.get("NASA_API_KEY") ?? "DEMO_KEY";
const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const TYPES = ["FLR", "CME", "GST"] as const;
type DonkiType = (typeof TYPES)[number];

const TTL_MIN = 15;

async function cachedFetch(supabase: any, key: string, endpoint: string, url: string) {
  const { data: cached } = await supabase
    .from("nasa_cache")
    .select("payload, expires_at")
    .eq("cache_key", key)
    .maybeSingle();
  if (cached && new Date(cached.expires_at) > new Date()) {
    return cached.payload;
  }
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`NASA ${endpoint} ${r.status}: ${await r.text()}`);
  }
  const payload = await r.json();
  const expires = new Date(Date.now() + TTL_MIN * 60_000).toISOString();
  await supabase
    .from("nasa_cache")
    .upsert({ cache_key: key, endpoint, payload, fetched_at: new Date().toISOString(), expires_at: expires });
  return payload;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate")!;
    const endDate = url.searchParams.get("endDate")!;
    if (!startDate || !endDate) {
      return new Response(JSON.stringify({ error: "startDate and endDate required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(SB_URL, SB_SRK);
    const results: Record<string, unknown> = {};
    for (const t of TYPES as readonly DonkiType[]) {
      const key = `donki:${t}:${startDate}:${endDate}`;
      const endpoint = `DONKI/${t}`;
      const apiUrl = `https://api.nasa.gov/DONKI/${t}?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_KEY}`;
      results[t] = await cachedFetch(supabase, key, endpoint, apiUrl);
    }
    return new Response(JSON.stringify(results), {
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
