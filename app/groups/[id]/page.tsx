import { supabaseServer } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getCurrentMonth, getCurrentDayOfMonth } from "@/lib/cadence";
import { getQuestionById, getQuestionsByIds } from "@/lib/questions";
import { ReflectionForm } from "./ReflectionForm";
import { LeaveGroupButton } from "./LeaveGroupButton";
import { InviteSection } from "./InviteSection";
import Link from "next/link";

export default async function GroupPage(props: { params: Promise<{ id: string }> }) {
  const { id: groupId } = await props.params;
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch group (including invite_token)
  const { data: group, error: groupErr } = await supabase
    .from("groups")
    .select("id, name, description, creator_id, invite_token, created_at")
    .eq("id", groupId)
    .single();

  if (!group || groupErr) {
    console.error("❌ Error fetching group:", groupErr);
    console.error("Group ID:", groupId);
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Group not found</h1>
        {groupErr && (
          <p className="text-red-600 mt-2">
            Error: {groupErr.message}
            {groupErr.code && ` (Code: ${groupErr.code})`}
          </p>
        )}
        <p className="text-zinc-600 mt-4">
          Group ID: {groupId}
        </p>
      </div>
    );
  }

  // Check membership
  const { data: membership } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  const isMember = Boolean(membership);
  const isCreator = group.creator_id === user.id;

  // Get current user's cadence assignments for this month (4 daily assignments)
  const currentMonth = getCurrentMonth();
  const monthStr = currentMonth.toISOString().split("T")[0];
  const currentDay = getCurrentDayOfMonth();
  
  let cadenceAssignments: any[] = [];
  if (isMember) {
    const { data: assignments } = await supabase
      .from("cadence_assignments")
      .select("*")
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .eq("assigned_month", monthStr)
      .order("assigned_day", { ascending: true });
    
    cadenceAssignments = assignments || [];
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{group.name}</CardTitle>
              {isCreator && (
                <span className="text-sm text-zinc-500 mt-1 block">You created this group</span>
              )}
            </div>
            {isMember && <LeaveGroupButton groupId={groupId} />}
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-zinc-600 mb-4">{group.description}</p>

          {!isMember && (
            <form action={`/api/groups/${groupId}/join`} method="post">
              <Button type="submit">Join Group</Button>
            </form>
          )}

          {isMember && (
            <div className="mt-6 space-y-6">
              {/* Invite Section */}
              {isCreator && group.invite_token && (
                <InviteSection
                  groupId={groupId}
                  inviteToken={group.invite_token}
                  isCreator={isCreator}
                />
              )}

              {/* Wrap Link */}
              <div className="flex justify-end gap-2">
                <Link href={`/groups/${groupId}/questions`}>
                  <Button variant="outline" size="sm">
                    View by Question
                  </Button>
                </Link>
                <Link href={`/groups/${groupId}/wrap`}>
                  <Button variant="outline" size="sm">
                    View Monthly Wrap
                  </Button>
                </Link>
              </div>

              {/* Cadence Assignment Info */}
              {cadenceAssignments.length > 0 && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h3 className="font-semibold mb-3">Your Reflection Days This Month</h3>
                  <p className="text-sm text-zinc-600 mb-4">
                    You have 4 reflection days assigned, roughly a week apart.
                  </p>
                  <div className="space-y-3">
                    {cadenceAssignments.map((assignment, idx) => {
                      const question = assignment.question_id 
                        ? getQuestionById(assignment.question_id)
                        : assignment.question_ids?.[0] 
                        ? getQuestionById(assignment.question_ids[0])
                        : null;
                      const isToday = assignment.assigned_day === currentDay;
                      const isPast = assignment.assigned_day < currentDay;
                      const isUpcoming = assignment.assigned_day > currentDay;
                      
                      return (
                        <div
                          key={assignment.id || idx}
                          className={`p-3 rounded border ${
                            isToday
                              ? "bg-white border-blue-400 shadow-sm"
                              : isPast
                              ? "bg-zinc-50 border-zinc-200"
                              : "bg-white border-zinc-200"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-sm">
                                Day {assignment.assigned_day}
                                {isToday && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                    Today
                                  </span>
                                )}
                                {isPast && !assignment.completed && (
                                  <span className="ml-2 text-xs text-orange-600">
                                    (Missed)
                                  </span>
                                )}
                                {assignment.completed && (
                                  <span className="ml-2 text-xs text-green-600">
                                    ✓ Completed
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          {question && (
                            <p className="text-sm text-zinc-700">{question.text}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {cadenceAssignments.length === 0 && (
                <Card className="p-4 bg-yellow-50 border-yellow-200">
                  <p className="text-sm text-yellow-700 mb-2">
                    No assignments for this month yet. Ask the group creator to generate the cadence.
                  </p>
                  {isCreator && (
                    <form action={`/api/groups/${groupId}/cadence`} method="post">
                      <Button type="submit" size="sm" variant="outline">
                        Generate Monthly Cadence
                      </Button>
                    </form>
                  )}
                </Card>
              )}

              {/* Reflection Form */}
              <ReflectionForm 
                groupId={groupId} 
                cadenceAssignments={cadenceAssignments}
                currentMonth={monthStr}
                currentDay={currentDay}
              />

              {/* Reflection list */}
              <ReflectionsList groupId={groupId} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/** Server Component — list reflections */
async function ReflectionsList({ groupId }: { groupId: string }) {
  const supabase = await supabaseServer();

  const { data: reflections, error } = await supabase
    .from("reflections")
    .select(`
      id,
      content,
      sentiment,
      question_id,
      question_ids,
      assigned_day,
      created_at,
      user_id,
      profiles:user_id (
        email
      )
    `)
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error loading reflections:", error);
  }

  if (!reflections || reflections.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Reflections</h2>
        <p className="text-zinc-500">No reflections yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Reflections</h2>
      <div className="space-y-4">
        {reflections.map((r) => {
          // Get primary question (prefer question_id, fallback to first in question_ids array)
          const primaryQuestionId = r.question_id || (r.question_ids && r.question_ids[0]);
          const primaryQuestion = primaryQuestionId ? getQuestionById(primaryQuestionId) : null;
          const allQuestions = r.question_ids ? getQuestionsByIds(r.question_ids) : [];
          
          return (
            <Card key={r.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-sm">
                      <span className="font-semibold">
                        {(r.profiles as any)?.email || "Unknown"}
                      </span>
                      {r.assigned_day && (
                        <span className="text-xs text-zinc-500 ml-2">(Day {r.assigned_day})</span>
                      )}
                    </CardTitle>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                  {r.sentiment && (
                    <span className="px-2 py-1 text-xs rounded-full bg-zinc-100 text-zinc-700">
                      {r.sentiment}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {primaryQuestion && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Question:</p>
                    <p className="text-sm text-blue-800">{primaryQuestion.text}</p>
                    {primaryQuestion.section && (
                      <p className="text-xs text-blue-600 mt-1">{primaryQuestion.section}</p>
                    )}
                  </div>
                )}
                {!primaryQuestion && allQuestions.length > 0 && (
                  <div className="mb-3 p-2 bg-zinc-50 rounded text-sm">
                    <p className="font-medium mb-1">Questions answered:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-zinc-600">
                      {allQuestions.map((q) => (
                        <li key={q.id} className="text-xs">{q.text}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{r.content}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
