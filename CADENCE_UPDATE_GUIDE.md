# Cadence Algorithm Update Guide

## What Changed

**Old System:**
- 1 assignment per month per user
- 4 questions answered at once
- Assigned to a week (1-4)

**New System:**
- 4 assignments per month per user
- 1 question per assignment
- Assigned to specific days (1-31)
- Roughly a week apart (5-9 day gaps)

## Database Updates Required

Run these SQL scripts in Supabase SQL Editor **in order**:

### 1. Update cadence_assignments table
Run: `update-cadence-to-daily.sql`

This adds:
- `assigned_day` column (day of month, 1-31)
- `question_id` column (single question instead of array)
- Updates unique constraint to use day instead of week

### 2. Add assigned_day to reflections
Run: `add-assigned-day-to-reflections.sql`

This adds:
- `assigned_day` column to reflections table

## Code Changes Made

✅ **Updated Files:**
1. `lib/cadence.ts` - New algorithm for daily assignments
2. `app/api/groups/[id]/cadence/route.ts` - Updated to handle daily assignments
3. `app/api/groups/[id]/reflect/route.ts` - Updated to handle single question per day
4. `app/groups/[id]/page.tsx` - Updated UI to show 4 daily assignments
5. `app/groups/[id]/ReflectionForm.tsx` - Updated to show daily questions

## How It Works Now

### Cadence Generation
- Each member gets 4 random days in the month
- Days are spaced roughly 5-9 days apart
- Each day gets 1 random question from the 40-question deck
- Days are sorted chronologically

### Reflection Submission
- User sees all 4 pending assignments
- Can select which day to reflect on
- Submits 1 reflection per day
- Each reflection answers 1 question

### UI Display
- Shows all 4 assignments in a card
- Highlights today's assignment
- Shows completed/missed status
- Allows selecting which day to answer

## Testing Steps

1. **Run Database Migrations**
   - Run `update-cadence-to-daily.sql`
   - Run `add-assigned-day-to-reflections.sql`

2. **Generate Cadence**
   - Go to a group
   - Click "Generate Monthly Cadence"
   - Should see 4 assignments per member

3. **View Assignments**
   - Should see "Your Reflection Days This Month"
   - Should show 4 days with questions
   - Today's day should be highlighted

4. **Submit Reflection**
   - Select a day (or use today's default)
   - See the question for that day
   - Submit reflection
   - Assignment should mark as completed

## Troubleshooting

### Error: "column assigned_day does not exist"
→ Run `update-cadence-to-daily.sql` and `add-assigned-day-to-reflections.sql`

### Error: "duplicate key value violates unique constraint"
→ The unique constraint changed. Delete old cadence_assignments and regenerate.

### No assignments showing
→ Make sure you ran the database migrations
→ Check that cadence was generated after migrations

### Can't submit reflection
→ Check browser console for errors
→ Verify question_id is being sent in form data

## Migration Order

1. ✅ Run `update-cadence-to-daily.sql`
2. ✅ Run `add-assigned-day-to-reflections.sql`
3. ✅ Delete old cadence_assignments (optional, or they'll be replaced on next generation)
4. ✅ Generate new cadence
5. ✅ Test reflection submission

## Backward Compatibility

The code maintains backward compatibility:
- Still accepts `assigned_week` in reflections (for old data)
- Still accepts `question_ids` array (converts to single question)
- Old cadence assignments will be replaced when new ones are generated

