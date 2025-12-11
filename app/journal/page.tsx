import { supabaseServer } from "@/lib/supabase-server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getQuestionsByIds } from "@/lib/questions";

export default async function JournalPage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Get all user's reflections across all groups
  const { data: reflections, error } = await supabase
    .from("reflections")
    .select(`
      id,
      content,
      sentiment,
      question_ids,
      created_at,
      group_id,
      groups:group_id (
        name,
        id
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error loading reflections:", error);
  }

  // Group reflections by month
  const reflectionsByMonth = reflections?.reduce((acc, reflection) => {
    const date = new Date(reflection.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(reflection);
    return acc;
  }, {} as Record<string, typeof reflections>);

  return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Journal</h1>
        <p className="text-zinc-600">
          All your reflections across all groups, organized by month.
        </p>
      </div>

      {!reflections || reflections.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-zinc-500">No reflections yet. Start reflecting in a group!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(reflectionsByMonth || {})
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([monthKey, monthReflections]) => {
              const [year, month] = monthKey.split("-");
              const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString(
                "default",
                { month: "long", year: "numeric" }
              );

              return (
                <div key={monthKey}>
                  <h2 className="text-2xl font-semibold mb-4">{monthName}</h2>
                  <div className="space-y-4">
                    {monthReflections.map((r: any) => {
                      const questions = r.question_ids
                        ? getQuestionsByIds(r.question_ids)
                        : [];
                      return (
                        <Card key={r.id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">
                                  {r.groups?.name || "Unknown Group"}
                                </CardTitle>
                                <p className="text-sm text-zinc-500 mt-1">
                                  {new Date(r.created_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                              {r.sentiment && (
                                <span className="px-3 py-1 text-sm rounded-full bg-zinc-100 text-zinc-700">
                                  {r.sentiment}
                                </span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            {questions.length > 0 && (
                              <div className="mb-4 p-3 bg-zinc-50 rounded">
                                <p className="font-medium mb-2 text-sm">Questions:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600">
                                  {questions.map((q) => (
                                    <li key={q.id}>{q.text}</li>
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
            })}
        </div>
      )}
    </div>
  );
}

