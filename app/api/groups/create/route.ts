import { NextResponse } from "next/server";
import { supabaseServerAction } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const supabase = await supabaseServerAction();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const { data, error } = await supabase
    .from("groups")
    .insert({
      name,
      description,
      creator_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Group create error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data || !data.id) {
    console.error("Group created but no data returned");
    return NextResponse.json({ error: "Group creation failed" }, { status: 500 });
  }

  console.log("✅ Group created successfully:", data.id);

  // Add creator as member
  await supabase.from("group_members").insert({
    group_id: data.id,
    user_id: user.id,
  });

  revalidatePath("/groups");
  revalidatePath("/groups/mine");

  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/groups/${data.id}`;
  return NextResponse.redirect(redirectUrl);
}
