import { createSupabaseServer } from "@/lib/supabase-server";

export async function syncUser() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("users").upsert({
    id: user.id,
    email: user.email,
  });
}
