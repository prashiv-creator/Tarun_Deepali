-- Supabase Database Schema - STEP BY STEP
-- Run each step separately in Supabase SQL Editor

-- ========================================
-- STEP 1: Create the main table
-- ========================================
CREATE TABLE IF NOT EXISTS wedding_wishes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_approved BOOLEAN DEFAULT true,
    ip_address TEXT,
    user_agent TEXT
);

-- ========================================
-- STEP 2: Create performance indexes
-- ========================================
CREATE INDEX IF NOT EXISTS idx_wedding_wishes_created_at ON wedding_wishes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wedding_wishes_name ON wedding_wishes(name);

-- ========================================
-- STEP 3: Enable Row Level Security (RLS)
-- ========================================
ALTER TABLE wedding_wishes ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 4: Create security policies
-- ========================================

-- Policy 1: Anyone can read approved wishes
CREATE POLICY "Anyone can view wedding wishes" ON wedding_wishes
    FOR SELECT USING (is_approved = true);

-- Policy 2: Anyone can insert new wishes
CREATE POLICY "Anyone can insert wedding wishes" ON wedding_wishes
    FOR INSERT WITH CHECK (true);

-- Policy 3: Authenticated users can update wishes
CREATE POLICY "Authenticated users can update wedding wishes" ON wedding_wishes
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy 4: Authenticated users can delete wishes
CREATE POLICY "Authenticated users can delete wedding wishes" ON wedding_wishes
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- STEP 5: Create statistics function
-- ========================================
CREATE OR REPLACE FUNCTION get_wedding_stats()
RETURNS TABLE(
    total_wishes BIGINT,
    today_wishes BIGINT,
    latest_wish TEXT,
    latest_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_wishes,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_wishes,
        (SELECT message FROM wedding_wishes ORDER BY created_at DESC LIMIT 1) as latest_wish,
        (SELECT name FROM wedding_wishes ORDER BY created_at DESC LIMIT 1) as latest_name
    FROM wedding_wishes 
    WHERE is_approved = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STEP 6: Grant permissions for the function
-- ========================================
GRANT EXECUTE ON FUNCTION get_wedding_stats() TO anon;
GRANT EXECUTE ON FUNCTION get_wedding_stats() TO authenticated;

-- ========================================
-- STEP 7: Create view for approved wishes only
-- ========================================
CREATE OR REPLACE VIEW approved_wedding_wishes AS
SELECT 
    id,
    name,
    message,
    created_at,
    to_char(created_at, 'DD/MM/YYYY HH12:MI:SS AM') as date
FROM wedding_wishes 
WHERE is_approved = true
ORDER BY created_at DESC;

-- ========================================
-- STEP 8: Grant permissions for the view
-- ========================================
GRANT SELECT ON approved_wedding_wishes TO anon;
GRANT SELECT ON approved_wedding_wishes TO authenticated;

-- ========================================
-- STEP 9: Add table comments (optional)
-- ========================================
COMMENT ON TABLE wedding_wishes IS 'Table to store wedding guest wishes and messages';
COMMENT ON COLUMN wedding_wishes.id IS 'Unique identifier for each wish';
COMMENT ON COLUMN wedding_wishes.name IS 'Name of the guest leaving the wish';
COMMENT ON COLUMN wedding_wishes.message IS 'The wedding wish/message content';
COMMENT ON COLUMN wedding_wishes.created_at IS 'Timestamp when the wish was created';
COMMENT ON COLUMN wedding_wishes.is_approved IS 'Whether the wish is approved for public display';
COMMENT ON COLUMN wedding_wishes.ip_address IS 'IP address of the submitter (optional)';
COMMENT ON COLUMN wedding_wishes.user_agent IS 'Browser user agent (optional)';

-- ========================================
-- SETUP COMPLETE!
-- ========================================
-- Now you can test by running:
-- SELECT * FROM get_wedding_stats();
-- SELECT * FROM approved_wedding_wishes LIMIT 5;
