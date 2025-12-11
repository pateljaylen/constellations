# Question Tracking Implementation

## Overview

Each reflection submission now tracks the specific question being answered, allowing you to group responses by question and see how different people respond to the same question.

## Database Changes

### Run This SQL First

Run `add-question-id-to-reflections.sql` in Supabase SQL Editor:

```sql
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS question_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_reflections_question_id ON reflections(question_id);
```

This adds:
- `question_id` column (single question ID for primary question)
- Index for efficient grouping by question

## How It Works

### Reflection Submission

1. **Form sends question_id**: The reflection form sends the specific `question_id` being answered
2. **API stores both**: 
   - `question_id` (primary, for grouping)
   - `question_ids` array (backward compatibility)
3. **Always tracked**: Every reflection now has a `question_id` linking it to the specific question

### Display

**On Group Page:**
- Each reflection shows the question it answers
- Question is displayed prominently in a blue box
- Shows question section/category

**New "View by Question" Page:**
- Navigate to `/groups/[id]/questions`
- See all reflections grouped by question
- Compare how different members respond to the same question
- Shows response count per question

## Features

### 1. Question Display in Reflections
- Each reflection card shows the question it answers
- Question text is prominently displayed
- Question section/category shown

### 2. Group by Question View
- New page: `/groups/[id]/questions`
- Groups all reflections by question_id
- Shows all responses to each question
- Easy to compare different perspectives

### 3. Question Tracking
- Every reflection has `question_id` stored
- Can query: "Show all responses to question #15"
- Can analyze: "Which questions get the most responses?"
- Can compare: "How did different people answer this question?"

## Usage

### View Responses by Question

1. Go to any group page
2. Click "View by Question" button
3. See all questions with their responses grouped together

### Query Examples

In Supabase SQL Editor, you can now run:

```sql
-- Get all responses to a specific question
SELECT * FROM reflections 
WHERE question_id = 15 
ORDER BY created_at DESC;

-- Count responses per question
SELECT question_id, COUNT(*) as response_count
FROM reflections
WHERE group_id = 'your-group-id'
GROUP BY question_id
ORDER BY response_count DESC;

-- See which questions are most popular
SELECT 
  question_id,
  COUNT(*) as responses,
  COUNT(DISTINCT user_id) as unique_responders
FROM reflections
WHERE group_id = 'your-group-id'
GROUP BY question_id
ORDER BY responses DESC;
```

## Data Structure

### Reflections Table
- `question_id` (INTEGER) - Primary question this reflection answers
- `question_ids` (INTEGER[]) - Array of question IDs (backward compatibility)
- Both are stored for maximum flexibility

### Why Both?

- `question_id`: Fast lookups, easy grouping, primary question
- `question_ids`: Backward compatibility, supports multi-question reflections (if needed in future)

## Testing

1. **Submit a reflection** with a question assigned
2. **Check database**: Verify `question_id` is stored
3. **View group page**: See question displayed with reflection
4. **View by question**: Go to `/groups/[id]/questions` to see grouping

## Benefits

✅ **Compare Perspectives**: See how different people answer the same question  
✅ **Question Analytics**: Track which questions get the most engagement  
✅ **Better Organization**: Group reflections by question for easier reading  
✅ **Insights**: Understand group dynamics through question responses  

