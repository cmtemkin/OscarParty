-- Run this in Supabase SQL Editor to add the global_winners table

CREATE TABLE global_winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id TEXT NOT NULL UNIQUE,
  nominee_id TEXT NOT NULL,
  marked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_global_winners_category ON global_winners(category_id);

ALTER TABLE global_winners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_global_winners" ON global_winners FOR SELECT USING (true);
