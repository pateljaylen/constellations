# Step-by-Step Setup Guide

**Goal**: Get Constellation running so you can create your first group.

Each step has:
- ✅ **Action**: What to do
- 🔍 **Verify**: How to confirm it worked
- ⚠️ **Troubleshooting**: What to do if it fails

---

## STEP 1: Verify Prerequisites

### ✅ Action
Check that you have everything installed:

```bash
# Check Node.js version (should be 18 or higher)
node --version

# Check npm
npm --version

# Check if you're in the right directory
pwd
# Should show: /Users/jaylenpatel/constellation/constellation-app
```

### 🔍 Verify
- [ ] Node.js version shows `v18.x.x` or higher
- [ ] npm version shows `9.x.x` or higher
- [ ] You're in the `constellation-app` directory

### ⚠️ Troubleshooting
- **Node.js too old?** Install from [nodejs.org](https://nodejs.org)
- **Wrong directory?** Run: `cd /Users/jaylenpatel/constellation/constellation-app`

---

## STEP 2: Install Dependencies

### ✅ Action
Install all required packages:

```bash
npm install
```

**What this does**: Downloads all packages listed in `package.json` (Next.js, Supabase, React, etc.)

**Expected time**: 1-3 minutes

### 🔍 Verify
Look for these in the output:
- [ ] `added XXX packages`
- [ ] No error messages
- [ ] `node_modules` folder exists (check with `ls -la`)

### ⚠️ Troubleshooting
- **"npm: command not found"** → Install Node.js
- **Network errors** → Check internet connection, try again
- **Permission errors** → Don't use `sudo`, fix npm permissions instead

---

## STEP 3: Create Supabase Project (if needed)

### ✅ Action
1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Click "New Project"
4. Fill in:
   - **Name**: `constellation` (or any name)
   - **Database Password**: Save this! (you'll need it)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for project to initialize

### 🔍 Verify
- [ ] Project appears in dashboard
- [ ] Status shows "Active" (green)
- [ ] You can see the project dashboard

### ⚠️ Troubleshooting
- **Project stuck?** Wait a few more minutes, refresh page
- **Can't create project?** Check if you've hit free tier limit

---

## STEP 4: Get Supabase Credentials

### ✅ Action
1. In Supabase dashboard, click your project
2. Click **Settings** (gear icon) in left sidebar
3. Click **API** in settings menu
4. Find these two values:

   **Project URL**:
   - Look for "Project URL" or "API URL"
   - Example: `https://abcdefghijklmnop.supabase.co`
   - Copy this value

   **Anon/Public Key**:
   - Look for "anon" or "public" key
   - It's a long string starting with `eyJ...`
   - Copy this value

### 🔍 Verify
- [ ] You have a URL starting with `https://` and ending with `.supabase.co`
- [ ] You have a key starting with `eyJ` (JWT token)
- [ ] Both are copied to clipboard or saved somewhere

### ⚠️ Troubleshooting
- **Can't find API settings?** Look for "Project Settings" → "API"
- **Key looks wrong?** Make sure it's the "anon" or "public" key, not the "service_role" key

---

## STEP 5: Create Environment File

### ✅ Action
1. In your terminal, make sure you're in `constellation-app` directory:
   ```bash
   cd /Users/jaylenpatel/constellation/constellation-app
   ```

2. Create `.env.local` file:
   ```bash
   touch .env.local
   ```

3. Open `.env.local` in your editor (VS Code, nano, etc.)

4. Paste this template:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=PASTE_YOUR_PROJECT_URL_HERE
   NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_YOUR_ANON_KEY_HERE
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

5. Replace the placeholders:
   - Replace `PASTE_YOUR_PROJECT_URL_HERE` with your Project URL from Step 4
   - Replace `PASTE_YOUR_ANON_KEY_HERE` with your Anon Key from Step 4
   - Keep `NEXT_PUBLIC_BASE_URL` as is

6. Save the file

**Example of what it should look like**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODU2Nzg5MCwiZXhwIjoxOTU0MTQzODkwfQ.example
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 🔍 Verify
Run this command to check your file (don't worry, it won't show the actual keys):
```bash
cat .env.local | grep -c "NEXT_PUBLIC"
```
- [ ] Output shows `3` (three environment variables)
- [ ] File exists: `ls -la .env.local` shows the file
- [ ] No typos in variable names (check spelling)

### ⚠️ Troubleshooting
- **File not found?** Make sure you're in `constellation-app` directory
- **Wrong format?** Each line should be `KEY=value` with no spaces around `=`
- **Keys not working?** Double-check you copied the full URL and key (they're long!)

---

## STEP 6: Run Base Database Schema

### ⚠️ CRITICAL: Run This BEFORE Migrations!

**You MUST run `schema.sql` first!** The migrations file depends on these base tables.

### ✅ Action
1. In Supabase dashboard, click **SQL Editor** in left sidebar
2. Click **New query**
3. Open the file `schema.sql` from your project
4. **Copy the ENTIRE contents** of `schema.sql` (all 224 lines)
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd+Enter / Ctrl+Enter)
7. Wait for completion (may take 10-30 seconds)

**What this does**: Creates all base tables (profiles, groups, group_members, reflections)

### 🔍 Verify
Look for success message:
- [ ] Green checkmark or "Success" message
- [ ] No red error messages
- [ ] Query executed successfully
- [ ] Message says something like "Success. No rows returned" or "Query executed successfully"

**CRITICAL: Double-check in Supabase**:
1. Click **Table Editor** in left sidebar
2. You should see these 4 tables:
   - [ ] `profiles` ← MUST exist before running migrations!
   - [ ] `groups` ← MUST exist before running migrations!
   - [ ] `group_members` ← MUST exist before running migrations!
   - [ ] `reflections` ← MUST exist before running migrations!

**If any table is missing, DO NOT proceed to Step 7!** Re-run `schema.sql`.

### ⚠️ Troubleshooting
- **"permission denied"** → Make sure you're using SQL Editor, not Table Editor
- **"relation already exists"** → Tables already created, that's okay! You can proceed to Step 7
- **Syntax errors** → Make sure you copied the entire file, including all semicolons
- **"relation does not exist"** → This means schema.sql didn't run successfully. Re-run it.

---

## STEP 7: Run Database Migrations

### ⚠️ IMPORTANT: Only Run This AFTER Step 6!

**Do NOT run this if Step 6 failed or if you don't see all 4 base tables!**

If you see error "relation profiles does not exist", go back to Step 6.

### ✅ Action
1. Still in Supabase SQL Editor
2. Click **New query** (or clear the previous one)
3. Open the file `schema-migrations.sql` from your project
4. **Copy the ENTIRE contents** of `schema-migrations.sql` (all 75 lines)
5. Paste into SQL Editor
6. Click **Run**
7. Wait for completion

**What this does**: Adds MVP features (sentiment, questions, cadence, invite tokens)

### 🔍 Verify
Look for success:
- [ ] Green checkmark or "Success" message
- [ ] No errors

**Run verification query**:
1. Click **New query**
2. Open `verify-migrations.sql`
3. Copy and paste into SQL Editor
4. Click **Run**
5. Should see: `✅ All migrations verified successfully!`

**Double-check in Table Editor**:
1. Click **Table Editor**
2. Click on `reflections` table
3. Check columns (should see):
   - [ ] `sentiment`
   - [ ] `question_ids`
   - [ ] `assigned_week`
   - [ ] `assigned_month`
4. Check for new table:
   - [ ] `cadence_assignments` table exists

### ⚠️ Troubleshooting
- **"relation profiles does not exist"** → **STOP!** Go back to Step 6. You must run `schema.sql` first!
- **"relation groups does not exist"** → **STOP!** Go back to Step 6. You must run `schema.sql` first!
- **"column already exists"** → Some columns might already be there, that's okay (migration uses IF NOT EXISTS)
- **"relation does not exist"** → Go back to Step 6, make sure base schema ran and all 4 tables exist
- **Verification fails** → Check which specific check failed, re-run that part of migration

---

## STEP 8: Configure Email Template

### ✅ Action
1. In Supabase dashboard, click **Authentication** in left sidebar
2. Click **Email Templates** (or "Templates")
3. Click on **Magic Link** template
4. Look at the email content
5. Find the link/button in the template
6. Make sure it contains: `{{ .ConfirmationURL }}`
   - If it says something else like `{{ .ConfirmationLink }}`, change it to `{{ .ConfirmationURL }}`
7. Click **Save** if you made changes

### 🔍 Verify
- [ ] Magic Link template is visible
- [ ] Link contains `{{ .ConfirmationURL }}`
- [ ] Template is saved

### ⚠️ Troubleshooting
- **Can't find Email Templates?** Look under Authentication → Settings → Email Templates
- **Template looks different?** That's okay, just make sure the link variable is correct

---

## STEP 9: Configure Redirect URL

### ✅ Action
1. Still in Supabase dashboard
2. Click **Authentication** → **URL Configuration** (or "Settings")
3. Find **Redirect URLs** section
4. Click **Add URL** or edit existing
5. Add: `http://localhost:3000/auth/callback`
6. Click **Save**

### 🔍 Verify
- [ ] `http://localhost:3000/auth/callback` appears in Redirect URLs list
- [ ] Changes are saved

### ⚠️ Troubleshooting
- **Can't find URL Configuration?** Look for "Redirect URLs" or "Site URL" in Authentication settings
- **Already has URLs?** Add this one to the list, don't replace existing ones

---

## STEP 10: Test Database Connection

### ✅ Action
1. In your terminal, make sure you're in `constellation-app`:
   ```bash
   cd /Users/jaylenpatel/constellation/constellation-app
   ```

2. Run the test script:
   ```bash
   npm run test:db
   ```

**What this does**: Tests if your app can connect to Supabase and access tables

### 🔍 Verify
Look for these in the output:
- [ ] `✅ profiles: accessible`
- [ ] `✅ groups: accessible`
- [ ] `✅ group_members: accessible`
- [ ] `✅ reflections: accessible`
- [ ] `✅ cadence_assignments: accessible`
- [ ] `✅ All reflection columns accessible`
- [ ] `✅ Groups invite_token accessible`
- [ ] `✅ Database connection test complete!`

### ⚠️ Troubleshooting
- **"Missing environment variables"** → Go back to Step 5, check `.env.local` file
- **"Invalid API key"** → Go back to Step 4, double-check your anon key
- **"relation does not exist"** → Go back to Steps 6-7, make sure migrations ran
- **"tsx: command not found"** → Run `npm install` again

---

## STEP 11: Start Development Server

### ✅ Action
1. In your terminal, make sure you're in `constellation-app`:
   ```bash
   cd /Users/jaylenpatel/constellation/constellation-app
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

**What this does**: Starts Next.js development server on port 3000

**Expected output**:
```
▲ Next.js 16.0.7
- Local:        http://localhost:3000
- Ready in 2.3s
```

### 🔍 Verify
- [ ] Server starts without errors
- [ ] You see "Ready" message
- [ ] Local URL shows `http://localhost:3000`
- [ ] No red error messages

**Test in browser**:
1. Open browser
2. Go to `http://localhost:3000`
3. You should see the Constellation home page (or login page)

### ⚠️ Troubleshooting
- **Port 3000 already in use** → Kill the other process or change port: `PORT=3001 npm run dev`
- **"Cannot find module"** → Run `npm install` again
- **Build errors** → Check terminal for specific error messages

---

## STEP 12: Test Login Flow

### ✅ Action
1. In browser, go to `http://localhost:3000`
2. If you see a login page, great! If not, click "Get Started" or go to `/login`
3. Enter your email address (use a real email you can access)
4. Click "Send Magic Link" or "Login"
5. Check your email inbox
6. Look for email from Supabase
7. Click the magic link in the email
8. You should be redirected back to the app

### 🔍 Verify
- [ ] Login page loads
- [ ] Email sent successfully (check for success message)
- [ ] Magic link email received (check spam if not in inbox)
- [ ] Clicking link redirects to app
- [ ] You're logged in (see profile or dashboard)

### ⚠️ Troubleshooting
- **No email received** → Check spam folder, wait 1-2 minutes, check email address
- **"Invalid link"** → Make sure redirect URL is configured (Step 9)
- **Redirects to wrong page** → Check `.env.local` has correct `NEXT_PUBLIC_BASE_URL`
- **"Missing tokens" error** → Check Step 9, make sure redirect URL is set

---

## STEP 13: Create Your First Group

### ✅ Action
1. After logging in, you should see the home page or dashboard
2. Look for "Create Group" button or link
   - Might be on home page
   - Or navigate to `/groups/create`
3. Fill in the form:
   - **Group Name**: e.g., "My First Group"
   - **Description**: e.g., "A test group for reflections"
4. Click "Create Group" or "Submit"
5. You should be redirected to the group page

### 🔍 Verify
- [ ] Form loads correctly
- [ ] Can type in both fields
- [ ] Submit button works
- [ ] Redirected to group page after creation
- [ ] Group name and description show on group page
- [ ] You see "You created this group" message
- [ ] You see an "Invite Others" section (if you're the creator)

**Check in Supabase**:
1. Go to Supabase dashboard
2. Click **Table Editor**
3. Click on `groups` table
4. You should see your new group:
   - [ ] Group name matches what you entered
   - [ ] `invite_token` column has a value (UUID string)
   - [ ] `creator_id` matches your user ID

**Check group_members**:
1. Click on `group_members` table
2. You should see one row:
   - [ ] `group_id` matches your new group
   - [ ] `user_id` matches your user ID
   - [ ] You're automatically a member!

### ⚠️ Troubleshooting
- **"Unauthorized" error** → Make sure you're logged in, refresh page
- **Form doesn't submit** → Check browser console for errors (F12)
- **Group not created** → Check Supabase logs, check terminal for errors
- **No invite token** → Check Step 7, make sure migrations ran

---

## 🎉 SUCCESS!

If you've completed all steps and verified everything, you're ready to use Constellation!

### What You Can Do Now:
- ✅ Create more groups
- ✅ Generate cadence (needs 2+ members)
- ✅ Submit reflections
- ✅ View your journal
- ✅ Invite others to groups

### Next Steps:
- Read `TESTING_GUIDE.md` for complete feature testing
- Try creating a second account to test group joining
- Generate cadence assignments
- Submit your first reflection

---

## Quick Reference: All Verification Points

Before moving to next step, verify:

1. ✅ Node.js 18+ installed
2. ✅ Dependencies installed (`node_modules` exists)
3. ✅ Supabase project created and active
4. ✅ Credentials copied (URL and anon key)
5. ✅ `.env.local` file created with 3 variables
6. ✅ Base schema ran (4 tables exist)
7. ✅ Migrations ran (new columns and table exist)
8. ✅ Email template has `{{ .ConfirmationURL }}`
9. ✅ Redirect URL configured
10. ✅ Database test passes (all ✅ checks)
11. ✅ Dev server runs on localhost:3000
12. ✅ Can login with magic link
13. ✅ Can create group and see it in database

---

## Need Help?

If you're stuck at any step:
1. Check the ⚠️ Troubleshooting section for that step
2. Check browser console (F12) for errors
3. Check terminal for error messages
4. Verify previous steps were completed correctly
5. Check `SETUP_GUIDE.md` for more details

