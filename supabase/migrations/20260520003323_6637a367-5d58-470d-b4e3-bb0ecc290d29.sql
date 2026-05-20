CREATE TABLE public.nasa_cache (
  cache_key TEXT PRIMARY KEY,
  endpoint TEXT NOT NULL,
  payload JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX nasa_cache_expires_at_idx ON public.nasa_cache (expires_at);
ALTER TABLE public.nasa_cache ENABLE ROW LEVEL SECURITY;
-- No public policies: only edge functions (service role) read/write this cache.