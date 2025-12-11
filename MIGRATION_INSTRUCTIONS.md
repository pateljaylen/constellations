# Database Migration Instructions

## Step 1: Run Base Schema (if not already done)

If you haven't set up your database yet, run `schema.sql` first in Supabase SQL Editor.

## Step 2: Run Migrations

1. **Open Supabase Dashboard**
   - Go to your project
   - Navigate to **SQL Editor**

2. **Run Migration Script**
   - Open `schema-migrations.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click **Run** (or press Cmd/Ctrl + Enter)

3. **Verify Migrations**
   - Open `verify-migrations.sql`
   - Copy and run in SQL Editor
   - Should see: `✅ All migrations verified successfully!`

## Step 3: Test Database Connection

Run the test script to verify everything works:

```bash
# Make sure you have .env.local with your Supabase credentials
npx tsx scripts/test-db-connection.ts
```

Or manually test in Supabase SQL Editor:

```sql
-- Quick test queries
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reflections' 
AND column_name IN ('sentiment', 'question_ids', 'assigned_week', 'assigned_month');

SELECT COUNT(*) FROM cadence_assignments;

SELECT id, name, invite_token FROM groups LIMIT 1;
```

## What Gets Added

### Reflections Table
- `sentiment` (TEXT) - User's mood/feeling
- `question_ids` (INTEGER[]) - Array of question IDs answered
- `assigned_week` (INTEGER) - Week number (1-4)
- `assigned_month` (DATE) - Month of assignment

### New Table: cadence_assignments
Tracks monthly week assignments for group members:
- `group_id`, `user_id`
- `assigned_week` (1-4)
- `assigned_month`
- `question_ids` (array of 4 question IDs)
- `completed` (boolean)

### Groups Table
- `invite_token` (TEXT) - Unique token for invite links

## Troubleshooting

### Error: "column already exists"
- Some columns might already exist
- The migration uses `IF NOT EXISTS` but if you see errors, you can skip those lines

### Error: "relation does not exist"
- Make sure you ran `schema.sql` first
- Check table names match exactly

### Error: "permission denied"
- Make sure you're using the SQL Editor (has full permissions)
- Not the Table Editor

## Rollback (if needed)

If you need to remove the migrations:

```sql
-- Remove columns from reflections
ALTER TABLE reflections 
DROP COLUMN IF EXISTS sentiment,
DROP COLUMN IF EXISTS question_ids,
DROP COLUMN IF EXISTS assigned_week,
DROP COLUMN IF EXISTS assigned_month;

-- Remove cadence_assignments table
DROP TABLE IF EXISTS cadence_assignments;

-- Remove invite_token from groups
ALTER TABLE groups DROP COLUMN IF EXISTS invite_token;
```

## Next Steps

After migrations are complete:
1. ✅ Run verification script
2. ✅ Test database connection
3. ✅ Start development server: `npm run dev`
4. ✅ Test features (see TESTING_GUIDE.md)

