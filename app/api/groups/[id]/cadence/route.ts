// app/api/groups/[id]/cadence/route.ts
// Generate cadence assignments for a group
// New: Assigns 4 random days per month with 1 question each
import { NextResponse } from "next/server";
import { supabaseServerAction } from "@/lib/supabase-server";
import { generateMonthlyCadence, getCurrentMonth } from "@/lib/cadence";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  // Extract group ID from params or URL as fallback
  let groupId = context.params?.id;
  
  // Fallback: extract from URL if params.id is missing
  if (!groupId) {
    const url = new URL(request.url);
    const pathMatch = url.pathname.match(/\/groups\/([^/]+)\/cadence/);
    if (pathMatch) {
      groupId = pathMatch[1];
      console.log("⚠️ Extracted groupId from URL:", groupId);
    }
  }

  console.log("🔍 Cadence API - groupId:", groupId);
  console.log("🔍 Cadence API - params:", context.params);

  if (!groupId) {
    console.error("❌ Missing group ID in cadence route");
    return NextResponse.json({ error: "Missing group ID" }, { status: 400 });
  }

  const supabase = await supabaseServerAction();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is group creator or member
  const { data: group } = await supabase
    .from("groups")
    .select("creator_id")
    .eq("id", groupId)
    .single();

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const { data: membership } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (group.creator_id !== user.id && !membership) {
    return NextResponse.json(
      { error: "Only group members can generate cadence" },
      { status: 403 }
    );
  }

  // Get all group members and verify they have profiles
  const { data: members, error: membersErr } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  if (membersErr || !members) {
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 400 }
    );
  }

  // Verify all members have profiles (fix foreign key constraint issues)
  const memberIds = members.map((m) => m.user_id);
  const { data: profiles, error: profilesErr } = await supabase
    .from("profiles")
    .select("id")
    .in("id", memberIds);

  if (profilesErr) {
    console.error("❌ Error checking profiles:", profilesErr);
    return NextResponse.json(
      { error: "Failed to verify member profiles" },
      { status: 400 }
    );
  }

  const validProfileIds = new Set(profiles?.map((p) => p.id) || []);
  const validMemberIds = memberIds.filter((id) => validProfileIds.has(id));

  if (validMemberIds.length === 0) {
    return NextResponse.json(
      { error: "No valid members found (missing profiles)" },
      { status: 400 }
    );
  }

  if (validMemberIds.length < memberIds.length) {
    console.warn(
      `⚠️ Filtered out ${memberIds.length - validMemberIds.length} members without profiles`
    );
  }
  const currentMonth = getCurrentMonth();
  const monthStr = currentMonth.toISOString().split("T")[0];

  // Generate cadence assignments (4 days per member, 1 question each)
  // Only use members with valid profiles to avoid foreign key errors
  const assignments = generateMonthlyCadence(validMemberIds, currentMonth);

  // Insert assignments into database
  const assignmentsToInsert = assignments.map((a) => ({
    group_id: groupId,
    user_id: a.user_id,
    assigned_day: a.assigned_day,
    assigned_month: monthStr,
    question_id: a.question_id,
    question_ids: [a.question_id], // Keep for backward compatibility until column is removed
    completed: false,
  }));

  // Delete existing assignments for this month first
  await supabase
    .from("cadence_assignments")
    .delete()
    .eq("group_id", groupId)
    .eq("assigned_month", monthStr);

  const { error: insertErr } = await supabase
    .from("cadence_assignments")
    .insert(assignmentsToInsert);

  if (insertErr) {
    console.error("❌ Cadence assignment error:", insertErr);
    return NextResponse.json({ error: insertErr.message }, { status: 400 });
  }

  revalidatePath(`/groups/${groupId}`);

  return NextResponse.json({
    success: true,
    assignments: assignments.length,
    assignmentsPerMember: 4,
    month: monthStr,
  });
}
