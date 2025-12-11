-- ============================================================================
-- COMPREHENSIVE CADENCE FIX
-- This script fixes all known issues with cadence_assignments in one go
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. Fix missing profiles for group members
-- ============================================================================
-- Ensure all users in group_members have profiles
-- This handles cases where profiles weren't auto-created

INSERT INTO profiles (id, email)
SELECT DISTINCT 
  gm.user_id,
  au.email
FROM group_members gm
JOIN auth.users au ON gm.user_id = au.id
LEFT JOIN profiles p ON gm.user_id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. Update cadence_assignments table structure
-- ============================================================================

-- Drop old unique constraint if it exists
ALTER TABLE cadence_assignments 
DROP CONSTRAINT IF EXISTS cadence_assignments_group_id_user_id_assigned_month_assigned_week_key;

-- Add assigned_day column (day of month, 1-31)
ALTER TABLE cadence_assignments 
ADD COLUMN IF NOT EXISTS assigned_day INTEGER CHECK (assigned_day BETWEEN 1 AND 31);

-- Add question_id column (single question instead of array)
ALTER TABLE cadence_assignments 
ADD COLUMN IF NOT EXISTS question_id INTEGER;

-- Make question_ids nullable (we're moving to single question_id)
ALTER TABLE cadence_assignments 
ALTER COLUMN question_ids DROP NOT NULL;

-- Make assigned_week nullable (we're moving to days)
ALTER TABLE cadence_assignments 
ALTER COLUMN assigned_week DROP NOT NULL;

-- Update unique constraint to use day instead of week
ALTER TABLE cadence_assignments 
DROP CONSTRAINT IF EXISTS cadence_assignments_unique;

ALTER TABLE cadence_assignments 
ADD CONSTRAINT cadence_assignments_unique 
UNIQUE(group_id, user_id, assigned_month, assigned_day);

-- ============================================================================
-- 3. Add indexes for performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_cadence_assignments_day 
ON cadence_assignments(assigned_day);

CREATE INDEX IF NOT EXISTS idx_cadence_assignments_question_id 
ON cadence_assignments(question_id);

CREATE INDEX IF NOT EXISTS idx_cadence_assignments_group_month_day 
ON cadence_assignments(group_id, assigned_month, assigned_day);

-- ============================================================================
-- 4. Fix RLS Policies for cadence_assignments
-- ============================================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Group creators and members can insert cadence assignments" ON cadence_assignments;
DROP POLICY IF EXISTS "Users can update their own cadence assignments" ON cadence_assignments;
DROP POLICY IF EXISTS "Group creators can delete cadence assignments" ON cadence_assignments;

-- INSERT Policy: Group creators can insert for any member, members can insert for themselves
CREATE POLICY "Group creators and members can insert cadence assignments"
  ON cadence_assignments FOR INSERT
  WITH CHECK (
    -- User must be authenticated
    auth.uid() IS NOT NULL
    AND (
      -- Option 1: User is the creator of the group (can insert for any member)
      EXISTS (
        SELECT 1 FROM groups
        WHERE id = cadence_assignments.group_id
        AND creator_id = auth.uid()
      )
      OR
      -- Option 2: User is inserting for themselves and is a member
      (
        user_id = auth.uid()
        AND EXISTS (
          SELECT 1 FROM group_members
          WHERE group_id = cadence_assignments.group_id
          AND user_id = auth.uid()
        )
      )
    )
    -- Ensure the target user is actually a member of the group
    AND EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = cadence_assignments.group_id
      AND user_id = cadence_assignments.user_id
    )
    -- Ensure the target user has a profile (foreign key constraint)
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = cadence_assignments.user_id
    )
  );

-- UPDATE Policy: Users can update their own assignments
CREATE POLICY "Users can update their own cadence assignments"
  ON cadence_assignments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE Policy: Group creators can delete (to regenerate cadence)
CREATE POLICY "Group creators can delete cadence assignments"
  ON cadence_assignments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE id = cadence_assignments.group_id
      AND creator_id = auth.uid()
    )
  );

-- ============================================================================
-- 5. Verify foreign key constraints
-- ============================================================================

-- Ensure foreign keys are correct
DO $$
BEGIN
  -- Check if foreign key exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'cadence_assignments_user_id_fkey'
  ) THEN
    ALTER TABLE cadence_assignments
    ADD CONSTRAINT cadence_assignments_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
  
  -- Check group_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'cadence_assignments_group_id_fkey'
  ) THEN
    ALTER TABLE cadence_assignments
    ADD CONSTRAINT cadence_assignments_group_id_fkey
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================================
-- 6. Clean up orphaned records (optional - uncomment if needed)
-- ============================================================================

-- Delete cadence_assignments for users without profiles
-- DELETE FROM cadence_assignments
-- WHERE user_id NOT IN (SELECT id FROM profiles);

-- Delete cadence_assignments for non-existent groups
-- DELETE FROM cadence_assignments
-- WHERE group_id NOT IN (SELECT id FROM groups);

-- ============================================================================
-- 7. Success message
-- ============================================================================

SELECT '✅ Comprehensive cadence fix completed successfully!' AS status;

-- Verify the fix
SELECT 
  'cadence_assignments' AS table_name,
  COUNT(*) AS total_assignments,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(DISTINCT group_id) AS unique_groups
FROM cadence_assignments;

