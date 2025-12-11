-- Add question_id column to reflections table for primary question tracking
-- Run this in Supabase SQL Editor

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS question_id INTEGER;

-- Add index for grouping by question
CREATE INDEX IF NOT EXISTS idx_reflections_question_id ON reflections(question_id);

-- Add comment
COMMENT ON COLUMN reflections.question_id IS 'Primary question ID this reflection answers (for grouping responses)';

-- Update existing reflections to extract question_id from question_ids array if possible
UPDATE reflections 
SET question_id = question_ids[1]
WHERE question_id IS NULL 
AND question_ids IS NOT NULL 
AND array_length(question_ids, 1) > 0;

