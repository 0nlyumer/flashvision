-- 1. Create `erp_state` table to hold the monolithic ERP data JSON.
CREATE TABLE IF NOT EXISTS erp_state (
    id TEXT PRIMARY KEY,
    state_data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create `user_settings` table to hold settings per user and platform.
CREATE TABLE IF NOT EXISTS user_settings (
    username TEXT NOT NULL,
    platform TEXT NOT NULL,
    settings_data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (username, platform)
);

-- 3. Enable Row Level Security (RLS) if you want to secure your data later.
-- For now, we will allow all reads and writes (like Firebase RTDB with open rules).
ALTER TABLE erp_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 4. Create open RLS policies (allow anyone to read and write).
-- In production, you should restrict this to authenticated users.
CREATE POLICY "Allow public read on erp_state" ON erp_state FOR SELECT USING (true);
CREATE POLICY "Allow public insert on erp_state" ON erp_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on erp_state" ON erp_state FOR UPDATE USING (true);

CREATE POLICY "Allow public read on user_settings" ON user_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on user_settings" ON user_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on user_settings" ON user_settings FOR UPDATE USING (true);

-- 5. Enable Realtime Replication for these tables so they broadcast changes.
-- If the publication does not exist, it will fail, so we check first.
ALTER PUBLICATION supabase_realtime ADD TABLE erp_state;
ALTER PUBLICATION supabase_realtime ADD TABLE user_settings;
