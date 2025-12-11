"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { getQuestionById } from "@/lib/questions";

interface ReflectionFormProps {
  groupId: string;
  cadenceAssignments: any[];
  currentMonth: string;
  currentDay: number;
}

const SENTIMENTS = [
  "grateful",
  "reflective",
  "challenged",
  "excited",
  "peaceful",
  "curious",
  "energized",
  "contemplative",
];

export function ReflectionForm({ 
  groupId, 
  cadenceAssignments, 
  currentMonth,
  currentDay 
}: ReflectionFormProps) {
  const [content, setContent] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find assignments that haven't been completed
  const pendingAssignments = cadenceAssignments.filter((a) => !a.completed);
  
  // Default to today's assignment if available, otherwise first pending
  const defaultAssignment = pendingAssignments.find((a) => a.assigned_day === currentDay) 
    || pendingAssignments[0];
  
  const activeAssignment = selectedDay 
    ? pendingAssignments.find((a) => a.assigned_day === selectedDay) || defaultAssignment
    : defaultAssignment;

  const activeQuestion = activeAssignment?.question_id 
    ? getQuestionById(activeAssignment.question_id)
    : activeAssignment?.question_ids?.[0]
    ? getQuestionById(activeAssignment.question_ids[0])
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !activeAssignment) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("content", content);
    if (sentiment) formData.append("sentiment", sentiment);
    
    // Use question_id if available, otherwise question_ids array
    const questionId = activeAssignment.question_id || activeAssignment.question_ids?.[0];
    if (questionId) {
      formData.append("question_id", questionId.toString());
      formData.append("question_ids", JSON.stringify([questionId]));
    }
    
    formData.append("assigned_day", activeAssignment.assigned_day.toString());
    formData.append("assigned_month", currentMonth);

    try {
      const response = await fetch(`/api/groups/${groupId}/reflect`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to submit reflection: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting reflection:", error);
      alert("Failed to submit reflection");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pendingAssignments.length === 0) {
    return (
      <Card className="p-4 bg-green-50 border-green-200">
        <p className="text-sm text-green-700">
          ✓ You've completed all your reflections for this month!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Submit Reflection</h2>
      
      {/* Day selector if multiple pending */}
      {pendingAssignments.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Day to Reflect On:</label>
          <div className="flex flex-wrap gap-2">
            {pendingAssignments.map((assignment) => {
              const question = assignment.question_id 
                ? getQuestionById(assignment.question_id)
                : null;
              const isSelected = selectedDay === assignment.assigned_day || 
                (!selectedDay && assignment === defaultAssignment);
              
              return (
                <button
                  key={assignment.assigned_day}
                  type="button"
                  onClick={() => setSelectedDay(assignment.assigned_day)}
                  className={`px-3 py-2 text-sm rounded border transition-colors ${
                    isSelected
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400"
                  }`}
                >
                  Day {assignment.assigned_day}
                  {assignment.assigned_day === currentDay && " (Today)"}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Show active question */}
      {activeQuestion && (
        <div className="mb-4 p-3 bg-zinc-50 rounded">
          <p className="text-sm font-medium mb-1">Today's Question:</p>
          <p className="text-sm text-zinc-700">{activeQuestion.text}</p>
          {activeAssignment && (
            <p className="text-xs text-zinc-500 mt-1">
              Day {activeAssignment.assigned_day} of this month
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">How are you feeling?</label>
          <div className="flex flex-wrap gap-2">
            {SENTIMENTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSentiment(sentiment === s ? "" : s)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  sentiment === s
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your Reflection</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write your reflection here..."
            className="w-full border rounded p-3 h-32 resize-none"
          />
        </div>

        <Button type="submit" disabled={isSubmitting || !content.trim() || !activeAssignment}>
          {isSubmitting ? "Submitting..." : "Submit Reflection"}
        </Button>
      </form>
    </Card>
  );
}
