import { supabaseServer } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getQuestionById } from "@/lib/questions";

export default async function QuestionsPage(props: {
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
    .select("id, name")
    .eq("id", groupId)
    .single();

  if (!group) {
    return <div className="p-10">Group not found</div>;
  }

  // Get all reflections grouped by question
  const { data: reflections } = await supabase
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

  // Group reflections by question_id
  const reflectionsByQuestion: Record<number, typeof reflections> = {};
  
  reflections?.forEach((r) => {
    const questionId = r.question_id || (r.question_ids && r.question_ids[0]);
    if (questionId) {
      if (!reflectionsByQuestion[questionId]) {
        reflectionsByQuestion[questionId] = [];
      }
      reflectionsByQuestion[questionId].push(r);
    }
  });

  // Get current month for filtering
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthStr = currentMonth.toISOString().split("T")[0];

  return (
    <div className="max-w-5xl mx-auto p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{group.name} — Responses by Question</h1>
        <p className="text-zinc-600">
          See how different members respond to the same questions
        </p>
      </div>

      {Object.keys(reflectionsByQuestion).length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-zinc-500">No reflections with questions yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(reflectionsByQuestion)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([questionIdStr, questionReflections]) => {
              const questionId = parseInt(questionIdStr);
              const question = getQuestionById(questionId);
              
              if (!question) return null;

              return (
                <Card key={questionId}>
                  <CardHeader>
                    <CardTitle className="text-lg mb-2">{question.text}</CardTitle>
                    <div className="flex gap-4 text-sm text-zinc-600">
                      <span>{question.section}</span>
                      <span>•</span>
                      <span>{questionReflections.length} response{questionReflections.length !== 1 ? 's' : ''}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {questionReflections.map((r) => (
                        <div
                          key={r.id}
                          className="border-b border-zinc-200 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">
                                {(r.profiles as any)?.email || "Unknown"}
                              </p>
                              <p className="text-sm text-zinc-500">
                                {new Date(r.created_at).toLocaleDateString()}
                                {r.assigned_day && ` • Day ${r.assigned_day}`}
                              </p>
                            </div>
                            {r.sentiment && (
                              <span className="px-2 py-1 text-xs rounded-full bg-zinc-100 text-zinc-700">
                                {r.sentiment}
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-700 whitespace-pre-wrap">{r.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}

