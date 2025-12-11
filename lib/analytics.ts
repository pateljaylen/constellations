import { createSupabaseServer } from "./supabase-server";

export async function getGroupSentimentSummary(groupId: string) {
  const supabase = createSupabaseServer();

  const { data } = await supabase
    .from("reflections")
    .select("sentiment")
    .eq("group_id", groupId);

  if (!data?.length) return null;

  const counts: Record<string, number> = {};
  for (const row of data) {
    if (!row.sentiment) continue;
    counts[row.sentiment] = (counts[row.sentiment] || 0) + 1;
  }

  const total = data.length;

  return {
    total,
    distribution: counts,
    proportions: Object.fromEntries(
      Object.entries(counts).map(([key, count]) => [key, count / total])
    ),
  };
}

export async function getUserReflectionStats(userId: string) {
  const supabase = createSupabaseServer();

  const { data } = await supabase
    .from("reflections")
    .select("sentiment")
    .eq("user_id", userId);

  if (!data?.length) return null;

  const counts: Record<string, number> = {};
  for (const row of data) {
    if (!row.sentiment) continue;
    counts[row.sentiment] = (counts[row.sentiment] || 0) + 1;
  }

  return counts;
}
