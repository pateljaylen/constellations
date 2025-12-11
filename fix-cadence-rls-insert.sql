-- Fix RLS Policy for cadence_assignments INSERT
-- Run this in Supabase SQL Editor

-- Allow group creators and members to insert cadence assignments
-- Group creators can insert for any member, members can only insert for themselves
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
  );

-- Also allow UPDATE to mark assignments as completed
CREATE POLICY "Users can update their own cadence assignments"
  ON cadence_assignments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow DELETE for group creators (to regenerate cadence)
CREATE POLICY "Group creators can delete cadence assignments"
  ON cadence_assignments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE id = cadence_assignments.group_id
      AND creator_id = auth.uid()
    )
  );

