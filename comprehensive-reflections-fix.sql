-- ============================================================================
-- COMPREHENSIVE REFLECTIONS TABLE FIX
-- This script adds all missing columns to reflections table in one go
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. Add all missing columns to reflections table
-- ============================================================================

-- Add sentiment column (user-selected mood)
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS sentiment TEXT;

-- Add question_ids array (for backward compatibility with old reflections)
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS question_ids INTEGER[];

-- Add question_id (single question ID for new daily cadence system)
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS question_id INTEGER;

-- Add assigned_week (for backward compatibility)
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS assigned_week INTEGER;

-- Add assigned_day (day of month, 1-31) - NEW COLUMN
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS assigned_day INTEGER CHECK (assigned_day BETWEEN 1 AND 31);

-- Add assigned_month (date of the month this reflection belongs to)
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS assigned_month DATE;

-- ============================================================================
-- 2. Add column comments for documentation
-- ============================================================================

COMMENT ON COLUMN reflections.sentiment IS 'User-selected mood/sentiment (e.g., grateful, reflective, challenged)';
COMMENT ON COLUMN reflections.question_ids IS 'Array of question IDs (backward compatibility)';
COMMENT ON COLUMN reflections.question_id IS 'Primary question ID for this reflection (for grouping responses by question)';
COMMENT ON COLUMN reflections.assigned_week IS 'Week number in the monthly cycle (1-4) - backward compatibility';
COMMENT ON COLUMN reflections.assigned_day IS 'Day of month (1-31) this reflection was assigned';
COMMENT ON COLUMN reflections.assigned_month IS 'Month this reflection belongs to (YYYY-MM-DD format)';

-- ============================================================================
-- 3. Add indexes for performance
-- ============================================================================

-- Index for question_id lookups (grouping by question)
CREATE INDEX IF NOT EXISTS idx_reflections_question_id 
ON reflections(question_id);

-- Index for assigned_day lookups
CREATE INDEX IF NOT EXISTS idx_reflections_assigned_day 
ON reflections(assigned_day);

-- Index for assigned_month lookups
CREATE INDEX IF NOT EXISTS idx_reflections_assigned_month 
ON reflections(assigned_month);

-- Composite index for common queries (group + month + day)
CREATE INDEX IF NOT EXISTS idx_reflections_group_month_day 
ON reflections(group_id, assigned_month, assigned_day);

-- Composite index for question grouping (group + question_id)
CREATE INDEX IF NOT EXISTS idx_reflections_group_question 
ON reflections(group_id, question_id);

-- Index for sentiment analysis
CREATE INDEX IF NOT EXISTS idx_reflections_sentiment 
ON reflections(sentiment);

-- ============================================================================
-- 4. Update existing reflections to populate question_id from question_ids
-- ============================================================================
-- If a reflection has question_ids but no question_id, use the first one

UPDATE reflections
SET question_id = question_ids[1]
WHERE question_id IS NULL 
AND question_ids IS NOT NULL 
AND array_length(question_ids, 1) > 0;

-- ============================================================================
-- 5. Verify RLS policies allow INSERT with new columns
-- ============================================================================
-- Check if INSERT policy exists, if not create one

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reflections' 
    AND policyname = 'Users can insert reflections in their groups'
  ) THEN
    CREATE POLICY "Users can insert reflections in their groups"
      ON reflections FOR INSERT
      WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
          SELECT 1 FROM group_members
          WHERE group_id = reflections.group_id
          AND user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- ============================================================================
-- 6. Verify foreign key constraints
-- ============================================================================

-- Ensure foreign keys are correct (they should already exist from schema.sql)
DO $$
BEGIN
  -- Check group_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'reflections_group_id_fkey'
  ) THEN
    ALTER TABLE reflections
    ADD CONSTRAINT reflections_group_id_fkey
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
  END IF;
  
  -- Check user_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'reflections_user_id_fkey'
  ) THEN
    ALTER TABLE reflections
    ADD CONSTRAINT reflections_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================================
-- 7. Success message and verification
-- ============================================================================

SELECT '✅ Comprehensive reflections fix completed successfully!' AS status;

-- Show current reflections table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'reflections'
ORDER BY ordinal_position;

-- Show count of reflections with new columns populated
SELECT 
  COUNT(*) AS total_reflections,
  COUNT(question_id) AS with_question_id,
  COUNT(assigned_day) AS with_assigned_day,
  COUNT(sentiment) AS with_sentiment,
  COUNT(assigned_month) AS with_assigned_month
FROM reflections;

