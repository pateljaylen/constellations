// Cadence Engine - Assigns reflection days to group members
// New algorithm: 4 random days per month, roughly a week apart, 1 question per day
import { getRandomQuestions, getQuestionById } from "./questions";

export interface CadenceAssignment {
  user_id: string;
  assigned_day: number; // Day of month (1-31)
  question_id: number; // Single question ID
  assigned_month: Date;
}

/**
 * Generate monthly cadence assignments for a group
 * Each member gets 4 random days in the month, roughly a week apart, with 1 question each
 */
export function generateMonthlyCadence(
  memberIds: string[],
  month: Date
): CadenceAssignment[] {
  if (memberIds.length === 0) return [];

  const assignments: CadenceAssignment[] = [];
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  
  // For each member, assign 4 days roughly a week apart
  for (const userId of memberIds) {
    const memberDays = selectFourDaysWithSpacing(daysInMonth);
    const questions = getRandomQuestions(4);
    
    for (let i = 0; i < 4; i++) {
      assignments.push({
        user_id: userId,
        assigned_day: memberDays[i],
        question_id: questions[i].id,
        assigned_month: month,
      });
    }
  }

  return assignments;
}

/**
 * Select 4 days in a month with roughly a week gap between them
 * Returns array of day numbers (1-31)
 */
function selectFourDaysWithSpacing(daysInMonth: number): number[] {
  const days: number[] = [];
  const minGap = 5; // Minimum 5 days between assignments
  const maxGap = 9; // Maximum 9 days between assignments
  
  // Start with a random day in the first week
  let currentDay = Math.floor(Math.random() * 7) + 1;
  days.push(currentDay);
  
  // Add 3 more days with spacing
  for (let i = 0; i < 3; i++) {
    const gap = minGap + Math.floor(Math.random() * (maxGap - minGap + 1));
    currentDay = Math.min(currentDay + gap, daysInMonth);
    
    // If we've reached the end, wrap around or adjust
    if (currentDay > daysInMonth) {
      currentDay = daysInMonth - (3 - i) * minGap;
      if (currentDay < 1) currentDay = 1;
    }
    
    days.push(currentDay);
  }
  
  // Sort days
  days.sort((a, b) => a - b);
  
  // Ensure we have exactly 4 unique days
  const uniqueDays = [...new Set(days)];
  while (uniqueDays.length < 4) {
    const newDay = Math.floor(Math.random() * daysInMonth) + 1;
    if (!uniqueDays.includes(newDay)) {
      uniqueDays.push(newDay);
    }
  }
  
  return uniqueDays.sort((a, b) => a - b).slice(0, 4);
}

/**
 * Get the current month's start date (first day of month)
 */
export function getCurrentMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Get the current day of month (1-31)
 */
export function getCurrentDayOfMonth(): number {
  return new Date().getDate();
}

/**
 * Check if a date is in the current month
 */
export function isCurrentMonth(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

/**
 * Get assignments for a specific day
 */
export function getAssignmentsForDay(
  assignments: CadenceAssignment[],
  day: number
): CadenceAssignment[] {
  return assignments.filter((a) => a.assigned_day === day);
}
