# Fix: "Group Not Found" Error After Creation

## The Problem

After creating a group, you're redirected to the group page but see "Group not found". This is likely an RLS (Row Level Security) policy issue.

## Quick Diagnosis

The group is probably being created successfully, but the RLS policy is preventing you from reading it back.

## Solution 1: Check RLS Policies (Most Likely Fix)

The groups table has an RLS policy that says "Anyone can view groups", but there might be an issue. Let's verify and fix:

### Step 1: Check Current Policies

Run this in Supabase SQL Editor:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'groups';

-- Check policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'groups';
```

### Step 2: Fix Groups RLS Policy

Run this in Supabase SQL Editor to ensure groups are readable:

```sql
-- Drop existing SELECT policy if it exists
DROP POLICY IF EXISTS "Anyone can view groups" ON groups;

-- Create a new policy that definitely works
CREATE POLICY "Anyone can view groups"
  ON groups FOR SELECT
  USING (true);
```

### Step 3: Verify Groups Table

Check if your group was actually created:

```sql
-- See all groups (should show your new group)
SELECT id, name, description, creator_id, created_at 
FROM groups 
ORDER BY created_at DESC 
LIMIT 5;
```

If you see your group here but not in the app, it's definitely an RLS issue.

## Solution 2: Check Group Creation Logs

### In Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try creating a group
4. Look for any error messages

### In Terminal

1. Check your terminal where `npm run dev` is running
2. Look for error messages when you submit the form

## Solution 3: Verify Group Was Created

### Check in Supabase

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Click on `groups` table
4. Check if your new group appears

**If the group exists in Supabase but not in the app:**
- It's an RLS policy issue → Use Solution 1

**If the group doesn't exist in Supabase:**
- Group creation failed → Check for errors in console/terminal

## Solution 4: Temporary Workaround (For Testing)

If you need to test quickly, you can temporarily disable RLS on groups:

```sql
-- TEMPORARY: Disable RLS for testing
ALTER TABLE groups DISABLE ROW LEVEL SECURITY;
```

**⚠️ IMPORTANT**: Re-enable RLS before going to production:

```sql
-- Re-enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
```

## Solution 5: Check Environment Variables

Make sure `NEXT_PUBLIC_BASE_URL` matches your actual URL:

```bash
# Check your .env.local
cat .env.local | grep BASE_URL
```

If you're running on port 3004 (as I saw in your env), make sure the redirect uses the correct port.

## Most Likely Fix

Run this in Supabase SQL Editor:

```sql
-- Fix groups RLS policy
DROP POLICY IF EXISTS "Anyone can view groups" ON groups;

CREATE POLICY "Anyone can view groups"
  ON groups FOR SELECT
  USING (true);

-- Also ensure authenticated users can create
DROP POLICY IF EXISTS "Authenticated users can create groups" ON groups;

CREATE POLICY "Authenticated users can create groups"
  ON groups FOR INSERT
  WITH CHECK (auth.uid() = creator_id);
```

Then try creating a group again.

## Debug Steps

1. **Check if group exists in database:**
   ```sql
   SELECT * FROM groups ORDER BY created_at DESC LIMIT 1;
   ```

2. **Check RLS is working:**
   ```sql
   -- This should return true
   SELECT rowsecurity FROM pg_tables WHERE tablename = 'groups';
   ```

3. **Check your user ID:**
   - In the app, go to `/me` page
   - Note your user ID
   - Check if it matches `creator_id` in the groups table

4. **Test with direct query:**
   - In Supabase SQL Editor, try:
   ```sql
   SELECT * FROM groups WHERE id = 'YOUR_GROUP_ID_HERE';
   ```
   - If this works but the app doesn't, it's definitely RLS

## Still Not Working?

If none of these work, check:
1. Browser console for JavaScript errors
2. Terminal for server errors
3. Network tab in DevTools for failed requests
4. Supabase logs (Dashboard → Logs → API)

