-- Constellation Schema Migrations
-- Run this AFTER the base schema.sql to add MVP features

-- ============================================================================
-- 1. Add fields to reflections table
-- ============================================================================

ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS sentiment TEXT,
ADD COLUMN IF NOT EXISTS question_ids INTEGER[],
ADD COLUMN IF NOT EXISTS assigned_week INTEGER,
ADD COLUMN IF NOT EXISTS assigned_month DATE;

-- Add comment
COMMENT ON COLUMN reflections.sentiment IS 'User-selected mood/sentiment (e.g., grateful, reflective, challenged)';
COMMENT ON COLUMN reflections.question_ids IS 'Array of question IDs from the question deck';
COMMENT ON COLUMN reflections.assigned_week IS 'Week number in the monthly cycle (1-4)';
COMMENT ON COLUMN reflections.assigned_month IS 'Month this reflection belongs to';

-- ============================================================================
-- 2. Create cadence_assignments table
-- ============================================================================

CREATE TABLE IF NOT EXISTS cadence_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_week INTEGER NOT NULL CHECK (assigned_week BETWEEN 1 AND 4),
  assigned_month DATE NOT NULL,
  question_ids INTEGER[] NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id, assigned_month, assigned_week)
);

-- Enable RLS
ALTER TABLE cadence_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own cadence assignments"
  ON cadence_assignments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view cadence assignments in their groups"
  ON cadence_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = cadence_assignments.group_id
      AND user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cadence_assignments_group_month ON cadence_assignments(group_id, assigned_month);
CREATE INDEX IF NOT EXISTS idx_cadence_assignments_user ON cadence_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_cadence_assignments_completed ON cadence_assignments(completed);

-- ============================================================================
-- 3. Add invite_token to groups table
-- ============================================================================

ALTER TABLE groups 
ADD COLUMN IF NOT EXISTS invite_token TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT;

CREATE INDEX IF NOT EXISTS idx_groups_invite_token ON groups(invite_token);

-- ============================================================================
-- 4. Update reflections indexes for new fields
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_reflections_assigned_month ON reflections(assigned_month);
CREATE INDEX IF NOT EXISTS idx_reflections_sentiment ON reflections(sentiment);

