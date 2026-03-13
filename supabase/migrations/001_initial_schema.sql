-- Run this in Supabase SQL Editor (supabase.com > your project > SQL Editor)

CREATE TABLE parties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  admin_password_hash TEXT NOT NULL,
  ceremony_locked BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_parties_slug ON parties(slug);

CREATE TABLE guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id UUID NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(party_id, name)
);

CREATE INDEX idx_guests_party_id ON guests(party_id);

CREATE TABLE picks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  party_id UUID NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  nominee_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guest_id, category_id)
);

CREATE INDEX idx_picks_party_id ON picks(party_id);
CREATE INDEX idx_picks_guest_id ON picks(guest_id);

CREATE TABLE winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id UUID NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  nominee_id TEXT NOT NULL,
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(party_id, category_id)
);

CREATE INDEX idx_winners_party_id ON winners(party_id);

-- RLS: allow reads from anon, writes only from service role
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_parties" ON parties FOR SELECT USING (true);
CREATE POLICY "anon_select_guests" ON guests FOR SELECT USING (true);
CREATE POLICY "anon_select_picks" ON picks FOR SELECT USING (true);
CREATE POLICY "anon_select_winners" ON winners FOR SELECT USING (true);

-- Service role bypasses RLS, so no INSERT/UPDATE/DELETE policies needed
