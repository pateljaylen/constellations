"use server";

import { createSupabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function createGroup(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  // Get authenticated user
  const supabaseServer = createSupabaseServer();

  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) {
    console.error("❌ No user found. User must be logged in to create a group.");
    redirect("/login");
  }

  // Insert group with the logged-in creator ID
  const { data: group, error } = await supabaseServer
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
    console.error("❌ Group creation error:", error);
    throw error;
  }

  console.log("✅ Group created:", group);

  redirect(`/group/${group.id}`);
}
