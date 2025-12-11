-- Fix Groups RLS Policy to Allow Viewing
-- Run this in Supabase SQL Editor if you get "Group not found" after creation

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view groups" ON groups;
DROP POLICY IF EXISTS "Authenticated users can create groups" ON groups;

-- Recreate with explicit permissions
CREATE POLICY "Anyone can view groups"
  ON groups FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create groups"
  ON groups FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Verify RLS is enabled
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Test query (should work after running this)
-- SELECT * FROM groups LIMIT 1;

