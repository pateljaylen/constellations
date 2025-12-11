# Fix: "relation profiles does not exist" Error

## The Problem

You're trying to run `schema-migrations.sql` before running the base `schema.sql`. 

The migrations file adds new columns and tables, but it assumes the base tables (`profiles`, `groups`, `group_members`, `reflections`) already exist.

## The Solution

**You must run `schema.sql` FIRST, then `schema-migrations.sql`.**

---

## Step-by-Step Fix

### Step 1: Run Base Schema First

1. In Supabase SQL Editor, click **New query** (or clear current query)

2. Open `schema.sql` from your project

3. **Copy the ENTIRE file** (all 224 lines)

4. Paste into SQL Editor

5. Click **Run** (or Cmd+Enter / Ctrl+Enter)

6. **Wait for success message**

### Step 2: Verify Base Tables Exist

Before running migrations, verify the base tables were created:

1. In Supabase dashboard, click **Table Editor** in left sidebar

2. You should see these 4 tables:
   - ✅ `profiles`
   - ✅ `groups`
   - ✅ `group_members`
   - ✅ `reflections`

3. If you see all 4 tables, proceed to Step 3

4. If any are missing, re-run `schema.sql`

### Step 3: Now Run Migrations

1. In SQL Editor, click **New query** (or clear previous)

2. Open `schema-migrations.sql` from your project

3. **Copy the ENTIRE file** (all 75 lines)

4. Paste into SQL Editor

5. Click **Run**

6. Should see success message

### Step 4: Verify Migrations

1. Click **New query**

2. Open `verify-migrations.sql`

3. Copy and paste

4. Click **Run**

5. Should see: `✅ All migrations verified successfully!`

---

## Quick Check: What Tables Should Exist?

After running BOTH files, you should have:

**From schema.sql:**
- `profiles`
- `groups`
- `group_members`
- `reflections`

**From schema-migrations.sql:**
- `cadence_assignments` (new table)
- Updated `reflections` (with new columns)
- Updated `groups` (with invite_token)

**Total: 5 tables**

---

## Still Getting Errors?

### Error: "relation profiles does not exist"
→ You haven't run `schema.sql` yet. Go to Step 1 above.

### Error: "column already exists"
→ Some columns might already exist. That's okay! The migration uses `IF NOT EXISTS` so it should be safe, but if you see this, you can ignore it.

### Error: "permission denied"
→ Make sure you're using the **SQL Editor**, not the Table Editor. SQL Editor has full permissions.

### Error: "syntax error"
→ Make sure you copied the ENTIRE file, including all semicolons and comments.

---

## Correct Order (Important!)

```
1. schema.sql          ← Run this FIRST (creates base tables)
2. schema-migrations.sql  ← Run this SECOND (adds MVP features)
3. verify-migrations.sql  ← Run this THIRD (verifies everything)
```

**Never skip step 1!**

---

## Visual Guide

```
Supabase SQL Editor
├── [New Query] ← Click this
├── Paste schema.sql
├── Click Run
├── ✅ Success!
│
├── [New Query] ← Click this again
├── Paste schema-migrations.sql
├── Click Run
├── ✅ Success!
│
└── [New Query] ← Click this again
    ├── Paste verify-migrations.sql
    ├── Click Run
    └── ✅ All migrations verified!
```

---

## Need More Help?

If you're still stuck:
1. Check that you're in the SQL Editor (not Table Editor)
2. Make sure you copied the ENTIRE schema.sql file
3. Verify the 4 base tables exist in Table Editor
4. Then try migrations again

