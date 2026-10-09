-- Run this SQL in your Supabase SQL Editor to create the necessary table

CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL
);

-- Optional: If you want to enable Row Level Security, you can do:
-- ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all read" ON assets FOR SELECT USING (true);
-- CREATE POLICY "Allow all insert" ON assets FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow all update" ON assets FOR UPDATE USING (true);
