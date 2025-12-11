-- Add assigned_day column to reflections table
-- Run this in Supabase SQL Editor

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS assigned_day INTEGER CHECK (assigned_day BETWEEN 1 AND 31);

CREATE INDEX IF NOT EXISTS idx_reflections_assigned_day ON reflections(assigned_day);

