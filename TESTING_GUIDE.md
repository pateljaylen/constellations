# Constellation Testing Guide

## Prerequisites

1. **Run Database Migrations**
   - Open Supabase SQL Editor
   - Run `schema-migrations.sql` (after base `schema.sql`)
   - Verify tables: `cadence_assignments` exists
   - Verify columns: `reflections` has `sentiment`, `question_ids`, `assigned_week`, `assigned_month`
   - Verify column: `groups` has `invite_token`

2. **Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Test Scenarios

### 1. Authentication Flow
**Steps:**
1. Go to `/login`
2. Enter email
3. Check email for magic link
4. Click magic link
5. Should redirect to `/me`

**Expected:**
- ✅ Magic link received
- ✅ Redirects to `/me` after clicking
- ✅ Session persists on page refresh
- ✅ Can navigate to protected pages

---

### 2. Group Creation
**Steps:**
1. Login
2. Go to `/groups/create`
3. Fill form: name, description
4. Submit

**Expected:**
- ✅ Group created successfully
- ✅ Redirected to group page
- ✅ User is automatically a member
- ✅ Invite token generated

---

### 3. Cadence Generation
**Steps:**
1. Create a group (or use existing)
2. Add at least 2 members (join with different accounts)
3. As creator, click "Generate Monthly Cadence"
4. Check group page

**Expected:**
- ✅ Cadence generated successfully
- ✅ Each member assigned to a week (1-4)
- ✅ Each member has 4 random questions
- ✅ Assignment visible on group page

---

### 4. Reflection Submission
**Steps:**
1. Join a group with cadence assignment
2. Go to group page
3. See assigned questions
4. Fill reflection form:
   - Select sentiment
   - Write reflection content
5. Submit

**Expected:**
- ✅ Reflection saved
- ✅ Sentiment saved
- ✅ Questions linked
- ✅ Assignment marked as completed
- ✅ Reflection appears in list

---

### 5. Leave Group
**Steps:**
1. Join a group
2. Go to group page
3. Click "Leave Group"
4. Confirm

**Expected:**
- ✅ Confirmation dialog appears
- ✅ User removed from group
- ✅ Redirected to groups list
- ✅ Can no longer access group page

---

### 6. Invite Link
**Steps:**
1. Create a group (as creator)
2. See invite section on group page
3. Copy invite link
4. Open in incognito/another browser
5. Login with different account
6. Visit invite link

**Expected:**
- ✅ Invite link visible to creator
- ✅ Link can be copied
- ✅ Link format: `/invite/[token]`
- ✅ Invite page shows group details
- ✅ Can join via invite link

---

### 7. Personal Journal
**Steps:**
1. Submit at least 2 reflections in different groups
2. Go to `/journal`
3. View reflections

**Expected:**
- ✅ All reflections visible
- ✅ Organized by month
- ✅ Shows group name, date, sentiment
- ✅ Shows questions if available
- ✅ Content displayed correctly

---

### 8. Monthly Wrap
**Steps:**
1. Create group with multiple members
2. Generate cadence
3. Have multiple members submit reflections
4. Go to `/groups/[id]/wrap`

**Expected:**
- ✅ Stats displayed (reflections count, members, participation)
- ✅ Sentiment distribution shown
- ✅ All reflections for month listed
- ✅ Questions visible in reflections

---

### 9. Reflection Display
**Steps:**
1. View group page with reflections
2. Check reflection cards

**Expected:**
- ✅ Author email shown
- ✅ Date/time displayed
- ✅ Sentiment badge visible
- ✅ Questions listed (if available)
- ✅ Content formatted correctly

---

### 10. Navigation
**Steps:**
1. Check navigation bar
2. Click all links

**Expected:**
- ✅ Navigation visible on all pages
- ✅ Links work: Groups, My Groups, Journal
- ✅ Profile button works
- ✅ Home page shows dashboard

---

## Edge Cases to Test

### 1. No Cadence Assignment
- User joins group but no cadence generated
- Should see message to generate cadence (if creator)
- Can still submit reflection without questions

### 2. Multiple Groups
- User in multiple groups
- Each group has separate cadence
- Journal shows all reflections

### 3. Empty States
- Group with no reflections
- Journal with no reflections
- Wrap with no reflections

### 4. Permissions
- Non-member can't see group content
- Non-creator can't generate cadence
- Only creator sees invite link

---

## Known Issues / Limitations

1. **Photo Uploads** - Not yet implemented
2. **Email Notifications** - Not yet implemented
3. **Week Restriction** - Users can submit reflections outside assigned week (intentional for MVP)
4. **Multiple Reflections** - Users can submit multiple reflections per month (intentional for MVP)

---

## Performance Checks

- [ ] Page load times < 2s
- [ ] Reflection submission < 1s
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Responsive on mobile

---

## Browser Testing

Test in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browser

---

## Database Verification

Run these queries in Supabase to verify:

```sql
-- Check cadence assignments
SELECT * FROM cadence_assignments;

-- Check reflections with new fields
SELECT id, sentiment, question_ids, assigned_week FROM reflections LIMIT 5;

-- Check groups with invite tokens
SELECT id, name, invite_token FROM groups LIMIT 5;
```

