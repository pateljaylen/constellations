-- Verification Script for Constellation Migrations
-- Run this AFTER schema-migrations.sql to verify everything was applied correctly

-- ============================================================================
-- 1. Verify reflections table has new columns
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reflections' AND column_name = 'sentiment'
    ) THEN
        RAISE EXCEPTION 'Missing column: reflections.sentiment';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reflections' AND column_name = 'question_ids'
    ) THEN
        RAISE EXCEPTION 'Missing column: reflections.question_ids';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reflections' AND column_name = 'assigned_week'
    ) THEN
        RAISE EXCEPTION 'Missing column: reflections.assigned_week';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reflections' AND column_name = 'assigned_month'
    ) THEN
        RAISE EXCEPTION 'Missing column: reflections.assigned_month';
    END IF;
END $$;

-- ============================================================================
-- 2. Verify cadence_assignments table exists
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'cadence_assignments'
    ) THEN
        RAISE EXCEPTION 'Missing table: cadence_assignments';
    END IF;
END $$;

-- ============================================================================
-- 3. Verify groups table has invite_token
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'groups' AND column_name = 'invite_token'
    ) THEN
        RAISE EXCEPTION 'Missing column: groups.invite_token';
    END IF;
END $$;

-- ============================================================================
-- 4. Verify indexes exist
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_cadence_assignments_group_month'
    ) THEN
        RAISE EXCEPTION 'Missing index: idx_cadence_assignments_group_month';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_groups_invite_token'
    ) THEN
        RAISE EXCEPTION 'Missing index: idx_groups_invite_token';
    END IF;
END $$;

-- ============================================================================
-- 5. Verify RLS policies exist
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'cadence_assignments' 
        AND policyname = 'Users can view their own cadence assignments'
    ) THEN
        RAISE EXCEPTION 'Missing RLS policy for cadence_assignments';
    END IF;
END $$;

-- ============================================================================
-- 6. Success message
-- ============================================================================

SELECT '✅ All migrations verified successfully!' AS status;

-- ============================================================================
-- 7. Show summary
-- ============================================================================

SELECT 
    'reflections' AS table_name,
    COUNT(*) AS column_count
FROM information_schema.columns 
WHERE table_name = 'reflections'
UNION ALL
SELECT 
    'cadence_assignments' AS table_name,
    COUNT(*) AS column_count
FROM information_schema.columns 
WHERE table_name = 'cadence_assignments'
UNION ALL
SELECT 
    'groups' AS table_name,
    COUNT(*) AS column_count
FROM information_schema.columns 
WHERE table_name = 'groups';

