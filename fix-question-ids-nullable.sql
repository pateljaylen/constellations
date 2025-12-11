-- Fix question_ids column to be nullable (we're using question_id now)
-- Run this in Supabase SQL Editor

-- Make question_ids nullable since we're moving to single question_id
ALTER TABLE cadence_assignments 
ALTER COLUMN question_ids DROP NOT NULL;

-- Optional: You can also set a default empty array for backward compatibility
-- ALTER TABLE cadence_assignments 
-- ALTER COLUMN question_ids SET DEFAULT ARRAY[]::INTEGER[];

