# Fix: "Could not find the 'assigned_day' column" Error

## The Problem

The `cadence_assignments` table doesn't have the `assigned_day` column yet. You need to run the database migration.

## Quick Fix

Run this SQL in Supabase SQL Editor:

```sql
-- Add assigned_day column to cadence_assignments
ALTER TABLE cadence_assignments 
ADD COLUMN IF NOT EXISTS assigned_day INTEGER CHECK (assigned_day BETWEEN 1 AND 31);

-- Add question_id column (single question instead of array)
ALTER TABLE cadence_assignments 
ADD COLUMN IF NOT EXISTS question_id INTEGER;

-- Make assigned_week nullable (we're moving to days)
ALTER TABLE cadence_assignments 
ALTER COLUMN assigned_week DROP NOT NULL;

-- Drop old unique constraint if it exists
ALTER TABLE cadence_assignments 
DROP CONSTRAINT IF EXISTS cadence_assignments_group_id_user_id_assigned_month_assigned_week_key;

-- Add new unique constraint using day
ALTER TABLE cadence_assignments 
ADD CONSTRAINT cadence_assignments_unique 
UNIQUE(group_id, user_id, assigned_month, assigned_day);

-- Add index for day lookups
CREATE INDEX IF NOT EXISTS idx_cadence_assignments_day 
ON cadence_assignments(assigned_day);
```

Or run the complete migration file: `update-cadence-to-daily.sql`

## Verify It Worked

After running, check:

```sql
-- Should show assigned_day and question_id columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cadence_assignments' 
AND column_name IN ('assigned_day', 'question_id');
```

You should see both columns listed.

## Then Try Again

After running the migration, try generating cadence again. It should work!

