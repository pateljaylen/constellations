// app/groups/create/actions.ts
"use server";

import { supabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function createGroup(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Insert group
  const { data: group, error } = await supabase
    .from("groups")
    .insert([
      {
        name,
        description,
        creator_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Group creation failed:", error);
    throw error;
  }

  // Add creator as member
  await supabase
    .from("group_members")
    .insert([{ group_id: group.id, user_id: user.id }]);

  redirect(`/group/${group.id}`);
}
