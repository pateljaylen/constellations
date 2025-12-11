-- Add missing updated_at column to groups table
-- Run this if you get "column groups.updated_at does not exist" error

ALTER TABLE groups 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Verify it was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'groups' 
AND column_name = 'updated_at';

