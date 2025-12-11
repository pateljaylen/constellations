// app/api/groups/[id]/reflect/route.ts
import { NextResponse } from "next/server";
import { supabaseServerAction } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  // --- Extract group ID ---
  // Handle both Next.js 14 and 15+ (params might be a Promise in 15+)
  let groupId = context.params?.id;
  
  // Fallback: extract from URL if params.id is missing
  if (!groupId) {
    const url = new URL(request.url);
    const pathMatch = url.pathname.match(/\/groups\/([^/]+)\/reflect/);
    if (pathMatch) {
      groupId = pathMatch[1];
      console.log("⚠️ Extracted groupId from URL:", groupId);
    }
  }

  console.log("🔍 Reflect API hit for group:", groupId);
  console.log("🔍 Reflect API - params:", context.params);
  console.log("🔍 Reflect API - URL:", request.url);

  if (!groupId) {
    console.error("❌ Missing group ID");
    console.error("❌ Context params:", context.params);
    return NextResponse.json({ error: "Missing group ID" }, { status: 400 });
  }

  // --- Parse form body ---
  const form = await request.formData();
  const content = form.get("content") as string;
  const sentiment = form.get("sentiment") as string;
  const questionIdsStr = form.get("question_ids") as string;
  const questionIdStr = form.get("question_id") as string;
  const assignedDayStr = form.get("assigned_day") as string;
  const assignedWeekStr = form.get("assigned_week") as string; // Backward compatibility
  const assignedMonthStr = form.get("assigned_month") as string;

  if (!content) {
    console.error("❌ Missing reflection content");
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  // Parse question ID(s) - prefer single question_id, fallback to question_ids array
  let questionId: number | null = null;
  let questionIds: number[] | null = null;
  
  if (questionIdStr) {
    questionId = parseInt(questionIdStr);
    questionIds = [questionId];
  } else if (questionIdsStr) {
    try {
      questionIds = JSON.parse(questionIdsStr);
      if (questionIds && questionIds.length > 0) {
        questionId = questionIds[0]; // Use first question as primary
      }
    } catch {
      // If not JSON, try comma-separated
      questionIds = questionIdsStr.split(",").map((id) => parseInt(id.trim())).filter(Boolean);
      if (questionIds && questionIds.length > 0) {
        questionId = questionIds[0];
      }
    }
  }
  
  // Final fallback
  if (!questionId && questionIds && questionIds.length > 0) {
    questionId = questionIds[0];
  }
  
  if (!questionId) {
    console.warn("⚠️ No question_id provided for reflection");
  }

  // Parse assigned day (new) or week (backward compatibility)
  const assignedDay = assignedDayStr ? parseInt(assignedDayStr) : null;
  const assignedWeek = assignedWeekStr ? parseInt(assignedWeekStr) : null;
  const assignedMonth = assignedMonthStr || null;

  // --- Supabase auth & client ---
  const supabase = await supabaseServerAction();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    console.error("❌ Auth error:", userErr);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // --- Get current month if not provided ---
  const currentMonth = assignedMonth || new Date().toISOString().split("T")[0];

  // --- Insert reflection ---
  const reflectionData: any = {
    group_id: groupId,
    user_id: user.id,
    content,
  };

  if (sentiment) reflectionData.sentiment = sentiment;
  if (questionId) reflectionData.question_id = questionId; // Primary question ID for grouping
  if (questionIds && questionIds.length > 0) reflectionData.question_ids = questionIds; // Keep array for backward compatibility
  if (assignedDay) reflectionData.assigned_day = assignedDay;
  if (assignedWeek) reflectionData.assigned_week = assignedWeek; // Backward compatibility
  if (assignedMonth) reflectionData.assigned_month = assignedMonth;
  
  // Log for debugging
  console.log("📝 Saving reflection with question_id:", questionId);

  const { error: insertErr } = await supabase.from("reflections").insert(reflectionData);

  if (insertErr) {
    console.error("❌ Reflection insert error:", insertErr);
    console.error("❌ Reflection data attempted:", reflectionData);
    
    // Provide more helpful error messages
    let errorMessage = insertErr.message || "Failed to save reflection";
    
    // Check for common schema errors
    if (insertErr.message?.includes("column") && insertErr.message?.includes("does not exist")) {
      errorMessage = `Database schema error: ${insertErr.message}. Please run the comprehensive-reflections-fix.sql migration in Supabase.`;
    } else if (insertErr.message?.includes("violates row-level security")) {
      errorMessage = "Permission denied. Please ensure you're a member of this group.";
    } else if (insertErr.message?.includes("violates foreign key constraint")) {
      errorMessage = "Data integrity error. Please contact support.";
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? insertErr.message : undefined
    }, { status: 400 });
  }

  // --- Mark cadence assignment as completed ---
  // New: Use assigned_day, fallback to assigned_week for backward compatibility
  if (assignedDay && assignedMonth) {
    await supabase
      .from("cadence_assignments")
      .update({ completed: true })
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .eq("assigned_day", assignedDay)
      .eq("assigned_month", assignedMonth);
  } else if (assignedWeek && assignedMonth) {
    // Backward compatibility
    await supabase
      .from("cadence_assignments")
      .update({ completed: true })
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .eq("assigned_week", assignedWeek)
      .eq("assigned_month", assignedMonth);
  }

  console.log("✅ Reflection saved!");

  // --- Revalidate the group page ---
  revalidatePath(`/groups/${groupId}`);

  // --- Next.js requires ABSOLUTE URL redirects inside Route Handlers ---
  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/groups/${groupId}`;

  return NextResponse.redirect(redirectUrl);
}
