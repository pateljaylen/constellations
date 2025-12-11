-- Fix RLS Policy Infinite Recursion Issue
-- Run this in Supabase SQL Editor if you see "infinite recursion" errors

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view members of groups they're in" ON group_members;

-- Create a better policy that doesn't cause recursion
CREATE POLICY "Users can view members of groups they're in"
  ON group_members FOR SELECT
  USING (
    auth.uid() = user_id
  );

-- Also allow viewing if user is authenticated (for testing)
-- In production, you might want to restrict this further
CREATE POLICY "Authenticated users can view group members"
  ON group_members FOR SELECT
  USING (auth.uid() IS NOT NULL);

