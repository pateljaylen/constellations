-- Update cadence_assignments table to support daily assignments
-- Run this in Supabase SQL Editor

-- Drop the old unique constraint
ALTER TABLE cadence_assignments 
DROP CONSTRAINT IF EXISTS cadence_assignments_group_id_user_id_assigned_month_assigned_week_key;

-- Add assigned_day column (day of month, 1-31)
ALTER TABLE cadence_assignments 
ADD COLUMN IF NOT EXISTS assigned_day INTEGER CHECK (assigned_day BETWEEN 1 AND 31);

-- Change question_ids to single question_id (since it's now 1 question per day)
ALTER TABLE cadence_assignments 
ADD COLUMN IF NOT EXISTS question_id INTEGER;

-- Make question_id NOT NULL for new records (after migration, existing records may be null)
-- We'll handle this in the application code for now

-- Make assigned_week nullable (we're moving to days)
ALTER TABLE cadence_assignments 
ALTER COLUMN assigned_week DROP NOT NULL;

-- Update unique constraint to use day instead of week
ALTER TABLE cadence_assignments 
ADD CONSTRAINT cadence_assignments_unique 
UNIQUE(group_id, user_id, assigned_month, assigned_day);

-- Add index for day lookups
CREATE INDEX IF NOT EXISTS idx_cadence_assignments_day 
ON cadence_assignments(assigned_day);

