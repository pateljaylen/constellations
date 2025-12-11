# Setup Checklist - Print This Page

Use this checklist to track your progress. Check off each item as you complete it.

---

## Prerequisites
- [ ] Node.js 18+ installed (`node --version` shows v18+)
- [ ] npm installed (`npm --version` works)
- [ ] In correct directory: `constellation-app`

## Step 1: Install Dependencies
- [ ] Ran `npm install`
- [ ] No errors in output
- [ ] `node_modules` folder exists

## Step 2: Supabase Project
- [ ] Created Supabase account
- [ ] Created new project
- [ ] Project status is "Active"

## Step 3: Get Credentials
- [ ] Found Project URL (starts with `https://`, ends with `.supabase.co`)
- [ ] Found Anon Key (starts with `eyJ`)
- [ ] Both values copied/saved

## Step 4: Environment File
- [ ] Created `.env.local` file
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` with your URL
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your key
- [ ] Added `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
- [ ] File saved

## Step 5: Base Database Schema
- [ ] Opened Supabase SQL Editor
- [ ] Copied entire `schema.sql` file
- [ ] Pasted and ran in SQL Editor
- [ ] Success message received
- [ ] Verified 4 tables exist: profiles, groups, group_members, reflections

## Step 6: Database Migrations
- [ ] Copied entire `schema-migrations.sql` file
- [ ] Pasted and ran in SQL Editor
- [ ] Success message received
- [ ] Ran `verify-migrations.sql`
- [ ] Saw "✅ All migrations verified successfully!"
- [ ] Verified `cadence_assignments` table exists
- [ ] Verified `reflections` has new columns: sentiment, question_ids, assigned_week, assigned_month
- [ ] Verified `groups` has `invite_token` column

## Step 7: Email Template
- [ ] Opened Authentication → Email Templates
- [ ] Found Magic Link template
- [ ] Verified link contains `{{ .ConfirmationURL }}`
- [ ] Saved if changes made

## Step 8: Redirect URL
- [ ] Opened Authentication → URL Configuration
- [ ] Added `http://localhost:3000/auth/callback`
- [ ] Saved changes

## Step 9: Test Database Connection
- [ ] Ran `npm run test:db`
- [ ] All checks show ✅
- [ ] No error messages

## Step 10: Start Server
- [ ] Ran `npm run dev`
- [ ] Server started successfully
- [ ] Saw "Ready" message
- [ ] Can access `http://localhost:3000` in browser

## Step 11: Test Login
- [ ] Went to login page
- [ ] Entered email address
- [ ] Received magic link email
- [ ] Clicked magic link
- [ ] Successfully logged in
- [ ] See dashboard/profile page

## Step 12: Create First Group
- [ ] Clicked "Create Group" or went to `/groups/create`
- [ ] Filled in group name
- [ ] Filled in description
- [ ] Submitted form
- [ ] Redirected to group page
- [ ] Group name and description visible
- [ ] See "You created this group" message
- [ ] See "Invite Others" section
- [ ] Verified in Supabase: group exists in `groups` table
- [ ] Verified in Supabase: you're in `group_members` table
- [ ] Verified in Supabase: `invite_token` has a value

---

## 🎉 All Done!

If all items are checked, you're ready to use Constellation!

**Next**: Try creating another group, or invite someone to join your first group.

---

## Notes Section

Use this space to write down any important information:

**My Supabase Project URL**: 
_________________________________________________

**My Supabase Anon Key**: 
_________________________________________________
(Keep this secure!)

**Issues Encountered**:
_________________________________________________
_________________________________________________
_________________________________________________

**Solutions Found**:
_________________________________________________
_________________________________________________
_________________________________________________

