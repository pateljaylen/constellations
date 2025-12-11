import { supabaseServer } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getQuestionsByIds } from "@/lib/questions";

export default async function MonthlyWrapPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = await props.params;
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Check membership
  const { data: membership } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return redirect(`/groups/${groupId}`);
  }

  // Get group
  const { data: group } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (!group) {
    return <div className="p-10">Group not found</div>;
  }

  // Get current month
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthStr = currentMonth.toISOString().split("T")[0];

  // Get all reflections for this month
  const { data: reflections } = await supabase
    .from("reflections")
    .select(`
      id,
      content,
      sentiment,
      question_ids,
      created_at,
      user_id,
      users:user_id (
        email
      )
    `)
    .eq("group_id", groupId)
    .gte("created_at", monthStr)
    .lt("created_at", new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString())
    .order("created_at", { ascending: false });

  // Get all members
  const { data: members } = await supabase
    .from("group_members")
    .select(`
      user_id,
      profiles:user_id (
        email
      )
    `)
    .eq("group_id", groupId);

  // Calculate stats
  const totalReflections = reflections?.length || 0;
  const totalMembers = members?.length || 0;
  const participationRate = totalMembers > 0 ? (totalReflections / totalMembers) * 100 : 0;

  // Sentiment distribution
  const sentimentCounts: Record<string, number> = {};
  reflections?.forEach((r) => {
    if (r.sentiment) {
      sentimentCounts[r.sentiment] = (sentimentCounts[r.sentiment] || 0) + 1;
    }
  });

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{group.name} — {monthName} Wrap</h1>
        <p className="text-zinc-600">A collective portrait of your group's reflections</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalReflections}</div>
            <div className="text-sm text-zinc-600">Reflections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalMembers}</div>
            <div className="text-sm text-zinc-600">Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{Math.round(participationRate)}%</div>
            <div className="text-sm text-zinc-600">Participation</div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Distribution */}
      {Object.keys(sentimentCounts).length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Group Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(sentimentCounts).map(([sentiment, count]) => (
                <div
                  key={sentiment}
                  className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-sm"
                >
                  {sentiment}: {count}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Reflections */}
      <Card>
        <CardHeader>
          <CardTitle>All Reflections</CardTitle>
        </CardHeader>
        <CardContent>
          {!reflections || reflections.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              No reflections for this month yet.
            </p>
          ) : (
            <div className="space-y-6">
              {reflections.map((r) => {
                const questions = r.question_ids ? getQuestionsByIds(r.question_ids) : [];
                return (
                  <div key={r.id} className="border-b border-zinc-200 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{r.users?.email}</p>
                        <p className="text-sm text-zinc-500">
                          {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {r.sentiment && (
                        <span className="px-2 py-1 text-xs rounded-full bg-zinc-100 text-zinc-700">
                          {r.sentiment}
                        </span>
                      )}
                    </div>
                    {questions.length > 0 && (
                      <div className="mb-3 p-2 bg-zinc-50 rounded text-sm">
                        <p className="font-medium mb-1 text-xs">Questions:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-xs text-zinc-600">
                          {questions.map((q) => (
                            <li key={q.id}>{q.text}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-zinc-700">{r.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

