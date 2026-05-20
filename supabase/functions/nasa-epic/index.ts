import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const NASA_KEY = Deno.env.get("NASA_API_KEY") ?? "DEMO_KEY";
const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TTL_MIN = 60;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(SB_URL, SB_SRK);
    const key = "epic:natural:latest";
    const { data: cached } = await supabase
      .from("nasa_cache")
      .select("payload, expires_at")
      .eq("cache_key", key)
      .maybeSingle();
    let payload: any;
    if (cached && new Date(cached.expires_at) > new Date()) {
      payload = cached.payload;
    } else {
      const r = await fetch(`https://api.nasa.gov/EPIC/api/natural?api_key=${NASA_KEY}`);
      if (!r.ok) throw new Error(`EPIC ${r.status}`);
      const list = await r.json();
      const latest = list[0];
      let imageUrl: string | null = null;
      if (latest?.image && latest?.date) {
        const d = new Date(latest.date);
        const yyyy = d.getUTCFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(d.getUTCDate()).padStart(2, "0");
        imageUrl = `https://api.nasa.gov/EPIC/archive/natural/${yyyy}/${mm}/${dd}/png/${latest.image}.png?api_key=${NASA_KEY}`;
      }
      payload = { latest, imageUrl };
      const expires = new Date(Date.now() + TTL_MIN * 60_000).toISOString();
      await supabase.from("nasa_cache").upsert({
        cache_key: key,
        endpoint: "EPIC/natural",
        payload,
        fetched_at: new Date().toISOString(),
        expires_at: expires,
      });
    }
    return new Response(JSON.stringify(payload), {
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
